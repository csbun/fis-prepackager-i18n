'use strict';

var i18nData = require('./src/i18n-data');
var buildComponents = require('./src/build-components');
var i18n = require('./src/i18n');
var packRelease = require('./src/pack-release');

module.exports = function (ret, conf, settings, opt) {

    var i18nArr = i18nData(ret, settings);

    // 检索全部文件
    fis.util.map(ret.src, function (subpath, file) {
        // 处理 packRelease
        packRelease(file, opt);

        // 处理入口 html
        if (file.isLayout && file.isHtmlLike) {
            // 组装 components
            buildComponents(file, ret, settings, opt);
            // 产生多个语言的文件
            i18n(file, i18nArr, ret);
        }
    });

};
