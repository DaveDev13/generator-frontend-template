# Основные возможности и используемые технологии

* Система сборки [Gulp](https://gulpjs.com/)
* Оптимизация изображений.
* Генерация PNG- и SVG-спрайтов.
* Шаблонизация с помощью [Nunjucks](http://mozilla.github.io/nunjucks/).
* CSS-препроцессор [SCSS](https://sass-scss.ru/) и [Autoprefixer](https://autoprefixer.github.io/ru/).
* ES6.
* Встроенное определение устройства, браузера и операционной системы пользователя.
* Проверка кода линтерами ([htmlhint](https://htmlhint.com/), [stylelint](https://stylelint.io/), [ESLint](http://eslint.org/)).
* [Browsersync](https://www.browsersync.io/), автоматическое обновление страницы при разработке.
* Возможность быстро создать архив проекта.
* Множество дополнительных параметров сборки.

# Минимальные требования

* node >= 9.5.0
* npm >= 5.6.0
* gulp >= 4.0.0
* gulp-cli >= 2.0.1

# Gulp-задачи

* `default` — основная задача, запускает `build`, `watch` и `serve`.
* `build` — сборка всех файлов, запускает задачи `copy`, `images`, `sprites:png`, `sprites:svg`, `html`, `scss`, `js`.
* `watch` — запускает слежение за файлами, так что при изменении они автоматически пересобираются.
* `serve` — запускает сервер Browsersync.
* `html` — запускает сборку Nunjucks-шаблонов.
* `images` — запускает сборку изображений.
* `sprites:png` — запускает генерацию PNG-спрайтов.
* `sprites:svg` — запускает генерацию SVG-спрайтов.
* `scss` — запускает сборку стилей.
* `js` — запускает сборку скриптов.
* `copy` — запускает сборку дополнительных ресурсов.
* `lint` — последовательно запускает линтеры `lint:js`, `lint:html`, `lint:scss`.
* `lint:js` — проверяет JavaScript-файлы линтером [ESLint](http://eslint.org/).
* `lint:html` — проверяет Html-файлы линтером [htmlhint](https://htmlhint.com/).
* `lint:scss` — проверяет SCSS-файлы линтером [stylelint](https://stylelint.io/).
* `optimize:svg` — оптимизирует и форматирует код SVG-файлов в папке `src/images`.
* `optimize:images` — оптимизирует изображения в папке `src/images`.
* `share` — Настройка динамических шерингов для SPA.
* `zip` — создает архив проекта.

## Дополнительные параметры:

* `--ci` — включает режим CI (`--no-cache --no-notify --no-open --throw-errors`).
* `--fix` — автоматически исправляет ошибки при проверке кода линтером (только для `lint:js`).
* `--minify` — включает минификацию файлов (только для `sprites:svg`, `html`, `scss` и `js`).
* `--minify-html` — включает минификацию HTML-файлов (имеет приоритет перед `--minify`).
* `--minify-css` — включает минификацию CSS-файлов (имеет приоритет перед `--minify`).
* `--minify-js` — включает минификацию JS-файлов (имеет приоритет перед `--minify`).
* `--minify-svg` — включает минификацию SVG-файлов (имеет приоритет перед `--minify`).
* `--no-cache` — отключает кэширование (только для `copy`, `images` и `html`).
* `--no-debug` — отключает отладочный вывод списка обрабатываемых файлов.
* `--no-notify` — отключает уведомления об ошибках.
* `--no-open` — отключает автоматический запуск браузера (только для `serve`).
* `--port` — задает порт сервера (только для `serve`).
* `--spa` — включает режим одностраничного приложения (только для `serve`).
* `--throw-errors` — прерывает сборку при возникновении ошибки.

# Структура папок и файлов

```text
ninelines-template
├── src
│   ├── images
│   │   └── sprites
│   │       ├── png
│   │       │   └── .keep
│   │       └── svg
│   │           └── .keep
│   ├── js
│   │   ├── components
│   │       └── .keep
│   │   ├── pages
│   │       └── .keep
│   │   ├── vendor
│   │   │   └── .keep
│   │   ├── main.js
│   │   └── vendor.js
│   ├── nunjucks
│   │   ├── components
│   │       └── .keep
│   │   ├── partials
│   │   │   ├── analytics
│   │   │   │   └── google.njk
│   │   │   │   └── yandex.njk
│   │   │   ├── mixins
│   │   │   │   └── icon.njk
│   │   │   └── links.njk
│   │   │   └── meta.njk
│   │   │   └── mixins.njk
│   │   ├── base.njk
│   │   ├── data.json
│   ├── pages
│   │   └── .keep
│   ├── resources
│   │   └── fonts
│   │       └── .keep
│   ├── scss
│   │   ├── components
│   │       └── .keep
│   │   ├── functions
│   │   │   └── _sprites.scss
│   │   ├── mixins
│   │   │   ├── _clearfix.scss
│   │   │   ├── _retina.scss
│   │   │   ├── _sprites.scss
│   │   │   ├── _triangle.scss
│   │   │   └── _visually-hidden.scss
│   │   ├── pages
│   │       └── .keep
│   │   ├── vendor
│   │   │   └── .keep
│   │   ├── _base.scss
│   │   ├── _commons.scss
│   │   ├── _fonts.scss
│   │   ├── _functions.scss
│   │   ├── _mixins.scss
│   │   ├── _sprites.hbs
│   │   ├── _sprites.scss
│   │   ├── _variables.scss
│   │   ├── _vendor.scss
│   │   └── main.scss
│   └── index.html(nunjucks/njk)
├── .babelrc
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .npmrc
├── .htmlhintrc.json
├── .stylelintignore
├── .stylelintrc
├── gulpfile.js
├── package.json
├── README.md
└── webpack.config.js
```

## `src`

В папке `src` хранятся исходные файлы проекта.

## `src/images`

Папка `images` предназначена для хранения изображений.
При сборке файлы из данной папки попадают в `build/images`.

## `src/images/sprites`

Папка `src/images/sprites` предназначена для хранения векторных (SVG) и растровых (PNG) иконок.

## `src/images/sprites/png`

Папка `src/images/sprites/png` предназначена для хранения растровых иконок.
При сборке файлы из данной папки объединяются в два спрайта: `build/images/sprites.png` и `build/images/sprites@2x.png`.

## `src/images/sprites/svg`

Папка `src/images/sprites/svg` предназначена для хранения векторных иконок.
При сборке файлы из данной папки объединяются в один спрайт: `build/images/sprites.svg`.

## `src/js`

Папка `src/js` предназначена для хранения скриптов.

## `src/js/components`

Папка `src/js/components` предназначена для хранения скриптов отдельных компонентов, которые можно переиспользовать в любом месте проекта.

## `src/js/pages`

Папка `src/js/pages` предназначена для хранения скриптов отдельной страницы, котроые не будут использоваться в других местах проекта.

## `src/js/vendor`

Папка `src/js/vendor` предназначена для хранения скриптов сторонних библиотек, которых нет в репозитории npm.

## `src/js/main.js`

Файл `src/js/main.js` предназначен для хранения основной логики сайта.
При сборке данный файл попадает в `build/js`.

## `src/js/vendor.js`

Файл `src/js/vendor.js` предназначен для подключения сторонних библиотек.

При сборке данный файл попадет в `build/js`.

## `src/nunjucks`

Папка `src/nunjucks` предназначена для хранения шаблонов.

## `src/nunjucks/components`

Папка `src/js/components` предназначена для хранения отдельных компонентов страниц, которые можно переиспользовать в любом месте проекта.

## `src/nunjucks/partials`

Папка `src/nunjucks/partials` предназначена для хранения базовых настроек проекта.

## `src/nunjucks/analytics`

Папка `src/nunjucks/analytics` предназначена для хранения настроек аналитики.

> `google / yandex` Обратите внимание что эти файлы содержат уникальные id метрики которые можно прописать в файле `data.json`

## `src/nunjucks/partials/mixins`

Папка `src/nunjucks/partials/mixins` предназначена для хранения Nunjucks-миксинов.

## `src/nunjucks/base.njk`

В файле `src/nunjucks/base.njk` хранится базовый шаблон страниц сайта.

## `src/nunjucks/data.json`

Файл `src/nunjucks/data.json` предназначен для настройки глобальных переменных для Nunjucks-шаблонов.

## `src/pages`

Папка `src/pages` предназначена для хранения Html(Nunjucks) файлов страниц.

Пример, мы создали файл `articles.njk` и папку `articles` c внутренней статьеё `article-1.njk` внутри папки `pages`, на выходе мы получим следующее
```text
build
├── articles
│   └── article-1.html
└── articles.html
```

## `src/resources`

Папка `src/resources` предназначена для хранения различных файлов проекта.
При сборке файлы из данной папки попадают в `build`.

## `src/resources/fonts`

Папка `src/resources/fonts` предназначена для хранения шрифтов.
При сборке файлы из данной папки попадают в `build/fonts`.

## `src/scss`

Папка `src/scss` предназначена для хранения стилей.

## `src/scss/functions`

Папка `src/scss/functions` предназначена для хранения SCSS-функций.

## `src/scss/mixins`

Папка `src/scss/mixins` предназначена для хранения SCSS-миксин.

## `src/scss/vendor`

Папка `src/scss/vendor` предназначена для хранения стилей сторонних библиотек, которых нет в репозитории npm.

## `src/scss/_base.scss`

Файл `src/scss/_base.scss` предназначен для хранения базовых стилей.

## `src/scss/_commons.scss`

Файл `src/scss/_commons.scss` предназначен для хранения базовых стилей.

## `src/scss/_fonts.scss`

Файл `src/scss/_fonts.scss` предназначен для подключения шрифтов.

## `src/scss/_functions.scss`

Файл `src/scss/_functions.scss` предназначен для подключения функций из папки `src/scss/functions`.

## `src/scss/_mixins.scss`

Файл `src/scss/_mixins.scss` предназначен для подключения миксин из папки `src/scss/mixins`.

## `src/scss/_sprites.hbs`

`src/scss/_sprites.hbs` — шаблон, на основе которого генерируется содержимое файла `src/scss/_sprites.scss`.

## `src/scss/_sprites.scss`

Файл `src/scss/_sprites.scss` предназначен для работы с PNG-спрайтами.
Содержимое данного файла автоматически генерируется на основе шаблона `src/scss/_sprites.hbs` и иконок из папки `src/images/sprites/png`.

## `src/scss/_variables.scss`

Файл `src/scss/_variables.scss` предназначен для хранения SCSS-переменных.

## `src/scss/_vendor.scss`

Файл `src/scss/_vendor.scss` предназначен для подключения стилей сторонних библиотек.

## `src/scss/main.scss`

Файл `src/scss/main.scss` предназначен для хранения основных стилей сайта.
При сборке данный файл преобразуется в CSS и сохраняется в `build/css` вместе с файлом `main.css.map`.

## `src/index.html(nunjucks/njk)`

`src/index.html(nunjucks/njk)` — шаблон главной страницы.
При сборке все nunjucks-файлы из папки `src` преобразуются в HTML и сохраняются в `build`.

## `.babelrc`

`.babelrc` — файл настроек JavaScript-транспайлера Babel.

## `.editorconfig`

`.editorconfig` — файл настроек редактора.

## `.eslintignore`

`.eslintignore` — файл настроек ESLint для игнорирования файлов.

## `.eslintrc`

`.eslintrc` — файл настроек ESLint.

## `.gitignore`

`.gitignore` — файл настроек Git для игнорирования файлов.

## `.npmrc`

`.npmrc` — файл настроек npm.

## `.htmlhintrc.json`

`.htmlhintrc.json` — файл настроек htmlhint.

## `.stylelintignore`

`.stylelintignore` — файл настроек stylelint для игнорирования файлов.

## `.stylelintrc`

`.stylelintrc` — файл настроек stylelint.

## `gulpfile.js`

`gulpfile.js` — основной файл сборки, содержащий Gulp-задачи.

## `package.json`

`package.json` — файл, содержащий базовую информацию о проекте и список требуемых библиотек.

## `README.md`

`README.md` — описание проекта.

## `webpack.config.js`

`webpack.config.js` — файл настроек webpack.