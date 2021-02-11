let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');
let yargs = require('yargs');
let path = require('path');
let del = require('del');
let webpackConfig = require('./webpack.config');
const req = require('./src/nunjucks/data.json');
let data = {
	now: new Date().getMinutes().toString(),
	...req,
};

let errorHandler;

let argv = yargs.default({
	cache: true,
	debug: true,
	fix: false,
	minifyHtml: null,
	minifyCss: null,
	minifySvg: null,
	notify: true,
	open: true,
	port: 3000,
	spa: false,
	throwErrors: false,
}).argv;

argv.minify = !!argv.minify;
argv.minifyHtml = argv.minifyHtml !== null ? !!argv.minifyHtml : argv.minify;
argv.minifyCss = argv.minifyCss !== null ? !!argv.minifyCss : argv.minify;
argv.minifySvg = argv.minifySvg !== null ? !!argv.minifySvg : argv.minify;

if (argv.ci) {
	argv.cache = false;
	argv.notify = false;
	argv.open = false;
	argv.throwErrors = true;
	argv.minifyHtml = true;

	webpackConfig.mode = 'production';
} else {
	webpackConfig.mode = webpackConfig.mode || 'development';
}

let $ = gulpLoadPlugins({
	overridePattern: false,
	pattern: [
		'autoprefixer',
		'browser-sync',
		'connect-history-api-fallback',
		'cssnano',
		'imagemin-mozjpeg',
		'merge-stream',
		'postcss-reporter',
		'postcss-scss',
		'stylelint',
		'uglifyjs-webpack-plugin',
		'vinyl-buffer',
		'webpack',
		'webpack-stream',
		'append-prepend',
	],
	scope: [
		'dependencies',
		'devDependencies',
		'optionalDependencies',
		'peerDependencies',
	],
});

if (argv.throwErrors) {
	errorHandler = false;
} else if (argv.notify) {
	errorHandler = $.notify.onError('<%= error.message %>');
} else {
	errorHandler = null;
}

function svgoConfig(minify = argv.minifySvg) {
	return (file) => {
		let filename = path.basename(file.relative, path.extname(file.relative));

		return {
			js2svg: {
				pretty: !minify,
				indent: '\t',
			},
			plugins: [
				{
					cleanupIDs: {
						minify: true,
						prefix: `${filename}-`,
					},
				},
				{
					removeTitle: true,
				},
				{
					removeViewBox: false,
				},
				{
					sortAttrs: true,
				},
			],
		};
	};
}

gulp.task('copy', () => {
	return gulp.src([
		'src/resources/**/*.*',
		'src/resources/**/.*',
		'!src/resources/**/.keep',
	], {
		base: 'src/resources',
		dot: true,
	})
		.pipe($.if(argv.cache, $.newer('build')))
		.pipe($.if(argv.debug, $.debug()))
		.pipe(gulp.dest('build'));
});

gulp.task('images', () => {
	return gulp.src('src/images/**/*.*')
		.pipe($.if(argv.cache, $.newer('build/images')))
		.pipe($.if(argv.debug, $.debug()))
		.pipe(gulp.dest('build/images'));
});

gulp.task('sprites:png', () => {
	const spritesData = gulp.src('src/images/sprites/png/*.png')
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.spritesmith({
			cssName: '_sprites.scss',
			cssTemplate: 'src/scss/_sprites.hbs',
			imgName: 'sprites.png',
			retinaImgName: 'sprites@2x.png',
			retinaSrcFilter: 'src/images/sprites/png/*@2x.png',
			padding: 2,
		}));

	return $.mergeStream(
		spritesData.img
			.pipe($.plumber({
				errorHandler,
			}))
			.pipe($.vinylBuffer())
			.pipe($.imagemin())
			.pipe(gulp.dest('build/images')),
		spritesData.css
			.pipe(gulp.dest('src/scss')),
	);
});

gulp.task('sprites:svg', () => {
	return gulp.src('src/images/sprites/svg/*.svg')
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.svgmin(svgoConfig()))
		.pipe($.svgstore())
		.pipe($.if(!argv.minifySvg, $.replace(/^\t+$/gm, '')))
		.pipe($.if(!argv.minifySvg, $.replace(/\n{2,}/g, '\n')))
		.pipe($.if(!argv.minifySvg, $.replace('?><!', '?>\n<!')))
		.pipe($.if(!argv.minifySvg, $.replace('><svg', '>\n<svg')))
		.pipe($.if(!argv.minifySvg, $.replace('><defs', '>\n\t<defs')))
		.pipe($.if(!argv.minifySvg, $.replace('><symbol', '>\n<symbol')))
		.pipe($.if(!argv.minifySvg, $.replace('></svg', '>\n</svg')))
		.pipe($.rename('sprites.svg'))
		.pipe(gulp.dest('build/images'));
});

const manageEnvironment = (environment) => {
	environment.addFilter('metadata', (meta, link, str) => {
		meta[link] = str;
	});
};

gulp.task('nunjucks', () => {
	let nunjucks = gulp.src([
		'src/[^_]*.+(html|nunjucks|njk)',
		'src/pages/**/[^_]*.+(html|nunjucks|njk)',
	])
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.nunjucksRender({
			manageEnv: manageEnvironment,
			data,
			noCache: true,
			tags: {
				blockStart: '<%',
				blockEnd: '%>',
				variableStart: '<$',
				variableEnd: '$>',
				commentStart: '<#',
				commentEnd: '#>',
			},
		}))
		.pipe($.htmlhint('.htmlhintrc.json'))
		.pipe($.htmlhint.reporter());

	if (argv.minifyHtml) {
		nunjucks = nunjucks.pipe($.htmlmin({
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			conservativeCollapse: true,
			removeCommentsFromCDATA: true,
			removeEmptyAttributes: true,
			removeRedundantAttributes: true,
		}));
	}

	nunjucks.pipe(gulp.dest('build'));

	return nunjucks;
});

gulp.task('scss', () => {
	const postcssPlugins = [
		$.autoprefixer({
			grid: 'autoplace',
		}),
	];

	if (argv.minifyCss) {
		postcssPlugins.push(
			$.cssnano({
				preset: [
					'default',
					{
						discardComments: {
							removeAll: true,
						},
					},
				],
			}),
		);
	}

	return gulp.src([
		'src/scss/*.scss',
		'!src/scss/_*.scss',
	])
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.postcss(postcssPlugins))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('build/css'));
});

gulp.task('js', () => {
	return gulp.src(webpackConfig.entry)
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.webpackStream(webpackConfig))
		.pipe(gulp.dest(webpackConfig.output.path));
});

gulp.task('lint:html', () => {
	return gulp.src('build/**/*.html')
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.bootlint({
			reportFn(file, lint, isError, isWarning, errorLocation) {
				let message = isError ? 'ERROR! - ' : 'WARN! - ';
				if (errorLocation) {
					message += `${file.path} (line:${errorLocation.line + 1}, col:${errorLocation.column + 1}) [${lint.id}] ${lint.message}`;
				} else {
					message += `${file.path}: ${lint.id} ${lint.message}`;
				}
				// eslint-disable-next-line no-console
				console.log(message);
			},
			summaryReportFn(file, errorCount, warningCount) {
				if (errorCount > 0 || warningCount > 0) {
					// eslint-disable-next-line no-console
					console.log(`please fix the ${errorCount} errors and ${warningCount} warnings in ${file.path}`);
				} else {
					// eslint-disable-next-line no-console
					console.log(`No problems found in ${file.path}`);
				}
			},
		}));
});

gulp.task('lint:scss', () => {
	return gulp.src([
		'src/scss/**/*.scss',
		'!src/scss/vendor/**/*.scss',
	])
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.postcss([
			$.stylelint(),
			$.postcssReporter({
				clearReportedMessages: true,
				throwError: argv.throwErrors,
			}),
		], {
			parser: $.postcssScss,
		}));
});

gulp.task('lint:js', () => {
	return gulp.src([
		'*.js',
		'src/js/**/*.js',
		'!src/js/vendor/**/*.js',
	], {
		base: '.',
	})
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.eslint({
			fix: argv.fix,
		}))
		.pipe($.eslint.format())
		.pipe($.if((file) => file.eslint && file.eslint.fixed, gulp.dest('.')));
});

gulp.task('validate:html', () => {
	return gulp.src('build/**/*.html')
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.w3cHtmlValidator());
});

gulp.task('optimize:images', () => {
	return gulp.src('src/images/**/*.*')
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.imagemin([
			$.imagemin.gifsicle({
				interlaced: true,
			}),
			$.imagemin.optipng({
				optimizationLevel: 3,
			}),
			$.imageminMozjpeg({
				progressive: true,
				quality: 80,
			}),
		]))
		.pipe(gulp.dest('src/images'));
});

gulp.task('optimize:svg', () => {
	return gulp.src('src/images/**/*.svg', {
		base: 'src/images',
	})
		.pipe($.plumber({
			errorHandler,
		}))
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.svgmin(svgoConfig(false)))
		.pipe(gulp.dest('src/images'));
});

gulp.task('watch', () => {
	gulp.watch([
		'src/resources/**/*.*',
		'src/resources/**/.*',
	], gulp.series('copy'));

	gulp.watch('src/images/**/*.*', gulp.series('images'));

	gulp.watch([
		'src/images/sprites/png/*.png',
		'src/scss/_sprites.hbs',
	], gulp.series('sprites:png'));

	gulp.watch('src/images/sprites/svg/*.svg', gulp.series('sprites:svg'));

	gulp.watch([
		'src/*.+(html|nunjucks|njk)',
		'src/nunjucks/**/[^_]*.+(html|nunjucks|njk|json)',
		'src/pages/**/*.+(html|nunjucks|njk|json)',
	], gulp.series('nunjucks'));

	gulp.watch('src/scss/**/*.scss', gulp.series('scss'));

	gulp.watch('src/js/**/*.js', gulp.series('js'));
});

gulp.task('serve', () => {
	let middleware = [];

	if (argv.spa) {
		middleware.push($.connectHistoryApiFallback());
	}

	$.browserSync
		.create()
		.init({
			notify: false,
			open: argv.open,
			port: argv.port,
			files: [
				'./build/**/*',
			],
			server: {
				baseDir: './build',
				middleware,
			},
		});
});

gulp.task('zip', () => {
	// eslint-disable-next-line global-require
	let name = require('./package').name;
	let now = new Date();
	let year = now.getFullYear().toString().padStart(2, '0');
	let month = (now.getMonth() + 1).toString().padStart(2, '0');
	let day = now.getDate().toString().padStart(2, '0');
	let hours = now.getHours().toString().padStart(2, '0');
	let minutes = now.getMinutes().toString().padStart(2, '0');

	return gulp.src([
		'build/**',
		'src/**',
		'.babelrc',
		'.editorconfig',
		'.eslintignore',
		'.eslintrc',
		'.gitignore',
		'.npmrc',
		'.stylelintignore',
		'.stylelintrc',
		'*.js',
		'*.json',
		'*.md',
		'*.yml',
		'!package-lock.json',
		'!zip/**',
	], {
		base: '.',
		dot: true,
	})
		.pipe($.zip(`${name}_${year}-${month}-${day}_${hours}-${minutes}.zip`))
		.pipe(gulp.dest('zip'));
});

gulp.task('share', () => {
	if (webpackConfig.mode !== 'production' || !argv.spa) {
		return del([
			'./build/index.php',
			'./build/shareSettings.php',
			'./build/.htaccess',
		]);
	}

	gulp.src('./build/index.html')
		.pipe($.if(argv.debug, $.debug()))
		.pipe($.appendPrepend.prependFile('./src/resources/shareSettings.php'))
		.pipe($.rename('index.php'))
		.pipe(gulp.dest('build'));

	return del([
		'./build/index.html',
		'./build/shareSettings.php',
	]);
});

gulp.task('lint', gulp.series(
	'lint:html',
	'lint:scss',
	'lint:js',
	'validate:html',
));

gulp.task('build', gulp.series(
	'copy',
	'nunjucks',
	'share',
	gulp.parallel(
		'images',
		'sprites:png',
		'sprites:svg',
		'scss',
		'js',
	),
));

gulp.task('default', gulp.series(
	'build',
	gulp.parallel(
		'watch',
		'serve',
	),
));
