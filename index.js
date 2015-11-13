'use strict';

var fs = require('fs');
var path = require('path');

var buildComponents = require('./src/build-components');
var i18n = require('./src/i18n');
var packRelease = require('./src/pack-release');


module.exports = function (ret, conf, settings, opt) {

    var EXT = '.json';
    var I18N_FOLDER = fis.project.getProjectPath(settings.folder || 'i18n');
    var DEFAULT_I18N = settings.defaultI18n || 'default';
    var CONNECTOR = settings.connector || '_';

    // 读取文件夹中的 i18n
    var i18nArr = fs.readdirSync(I18N_FOLDER).filter(function (f) {
        // 只要 .json 文件
        return path.extname(f) === EXT;
    }).map(function (f) {
        // 读取 i18n 的 josn 内容
        var i18n = path.basename(f, EXT);
        var i18nFilePath = path.join(I18N_FOLDER, f);
        var out = {
            i18n: i18n,
            file: i18nFilePath,
            connector: CONNECTOR,
            isDefault: i18n === DEFAULT_I18N
        };
        try {
            out.data = JSON.parse(fs.readFileSync(i18nFilePath, 'utf8'));
        } catch (e) {
            out.data = {};
            console.log(e);
        }
        return out;
    });

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
