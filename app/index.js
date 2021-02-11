let Generator = require('yeoman-generator');
let path = require('path');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.argument('path', {
			desc: 'Project path',
			required: false,
			type: String,
			default: '.',
		});

		this.destinationRoot(this.options.path);
	}

	prompting() {
		return this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Project name',
				default: path.basename(this.destinationRoot()),
			},
			{
				type: 'input',
				name: 'description',
				message: 'Project description',
				default: '',
			},
			{
				type: 'confirm',
				name: 'npmInstall',
				message: 'Install npm packages?',
				default: true,
			},
		]).then((answers) => {
			this.answers = answers;
		});
	}

	writing() {
		this.fs.copy(
			this.templatePath('src'),
			this.destinationPath('src'),
			{
				globOptions: {
					dot: true,
				},
			}
		);

		this.fs.copy(
			this.templatePath('babelrc'),
			this.destinationPath(`.babelrc`)
		);

		this.fs.copy(
			this.templatePath('editorconfig'),
			this.destinationPath(`.editorconfig`)
		);

		this.fs.copy(
			this.templatePath('eslintignore'),
			this.destinationPath(`.eslintignore`)
		);

		this.fs.copy(
			this.templatePath('eslintrc'),
			this.destinationPath(`.eslintrc`)
		);

		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath(`.gitignore`)
		);

		this.fs.copy(
			this.templatePath('npmrc'),
			this.destinationPath(`.npmrc`)
		);

		this.fs.copy(
			this.templatePath('htmlhintrc.json'),
			this.destinationPath(`.htmlhintrc.json`)
		);

		this.fs.copy(
			this.templatePath('stylelintignore'),
			this.destinationPath('.stylelintignore')
		);

		this.fs.copy(
			this.templatePath('stylelintrc'),
			this.destinationPath('.stylelintrc')
		);

		this.fs.copy(
			this.templatePath('gulpfile.js'),
			this.destinationPath(`gulpfile.js`)
		);

		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath(`package.json`),
			{
				name: this.answers.name,
				description: this.answers.description,
			}
		);

		this.fs.copy(
			this.templatePath('README.md'),
			this.destinationPath(`README.md`)
		);

		this.fs.copy(
			this.templatePath('webpack.config.js'),
			this.destinationPath(`webpack.config.js`)
		);
	}

	install() {
		if (this.answers.npmInstall) {
			this.npmInstall();
		}
	}
};
