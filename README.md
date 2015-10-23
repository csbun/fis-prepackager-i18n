# scrat-preprocessor-i18n

A i18n preprocessor for [fis](http://fex-team.github.io/fis-site/)/[Scrat](http://scrat.io) using [ejs](https://www.npmjs.com/package/ejs)


## Usage

### i18n

```
src
├── fis-conf.js
├── i18n-folder-name
│   ├── en.json
│   ├── zh.json
│   └── ...
├── package.json
└── views
    ├── index.html
    ├── some.html
    └── ...(more html)
```

### fis-conf.js

```javascript
fis.config.set('settings.preprocessor.i18n', {
    folder: 'i18n-folder-name',
    i18n: 'en'
}); 
fis.config.set('modules.preprocessor.html', 'i18n');
```
