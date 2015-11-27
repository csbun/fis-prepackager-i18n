# fis-prepackager-i18n

A i18n prepackager for [fis](http://fex-team.github.io/fis-site/)/[Scrat](http://scrat.io) using [ejs](https://www.npmjs.com/package/ejs)


## Usage

### i18n

```
src
├── fis-conf.js
├── i18n-folder-name
│   ├── en.json
│   ├── zh.json
│   └── ...
├── components
│   ├── header
│   │   └── header.html
│   ├── some-section
│   │   └── some-section.html
│   └── ...
├── package.json
└── views
    ├── index
    │   ├── index.less
    │   ├── index.js
    │   ├── index.html
    │   └── ...
    ├── some
    │   ├── some.html
    │   └── ...
    └── ...(more views)
```

### fis-conf.js

```javascript
fis.config.set('settings.prepackager.i18n', {
    folder: 'i18n-folder-name',
    defaultI18n: 'en',
    connector: '_'
});
```

#### fis2

```javascript
fis.config.set('modules.prepackager', 'i18n');
fis.config.set('roadmap.path', [
    {
        // source html
        reg: 'views/**/*.html',
        // `isLayout` should be `TRUE`
        isLayout: true
    },
    {
        // other html `isLayout` != `TRUE`
        reg: '**/*.html'
    }
]);
```

#### fis3

```javascript
fis.match('*.html', {
    release: '$0'
    // other html `isLayout` != `TRUE`
});
fis.match('views/**/*.html', {
    release: '$0',
    // `isLayout` should be `TRUE`
    isLayout: true
});
fis.match('::package', {
    prepackager: fis.plugin('i18n')
});
```

## Example

### i18n

- en.json

```
{
    "id": "EN",
    "hello": "hello",
    "world": "world"
}
```

- zh.json

```
{
    "id": "ZH",
    "hello": "你好",
    "world": "世界"
}
```

### html

- components/header/header.html

```html
<div class="header">
    <%= hello %>
</div>
```

- components/some-section/some-section.html

```html
<div data-cmp="some-section">
    <%= world %>
</div>
```

- views/index/index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>view - index</title>
    <link rel="stylesheet" type="text/css" href="index.less">
</head>
<body>
    <h1>
    <% if (id === 'en') { %>
        here is `<%= id %>`
    <% } else { %>
        这里是 `<%= id %>`
    <% } %>
    </h1>

    <!-- Components here -->
    {{{unit name="header"}}}
    {{{unit name="some-section"}}}
    <!-- Components end -->

    <script type="text/javascript" src="index.js"></script>
</body>
</html>
```

### output

- views/index/index.html (defaultI18n == 'en')
- views/index/index_en.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>view - index</title>
    <link rel="stylesheet" type="text/css" href="index.css">
</head>
<body>
    <h1>
        here is `EN`
    </h1>

    <!-- Components here -->
    <div class="header">
        hello
    </div>
    
    <div data-cmp="some-section">
        world
    </div>
    <!-- Components end -->

    <script type="text/javascript" src="index.js"></script>
</body>
</html>
```

- views/index/index_zh.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>view - index</title>
    <link rel="stylesheet" type="text/css" href="index.css">
</head>
<body>
    <h1>
        这里是 `ZH`
    </h1>

    <!-- Components here -->
    <div class="header">
        你好
    </div>
    
    <div data-cmp="some-section">
        世界
    </div>
    <!-- Components end -->

    <script type="text/javascript" src="index.js"></script>
</body>
</html>
```