'use strict';

var fs = require('fs');
var path = require('path');
var util = require('./util');

var EXT = '.json';
var PROJECT_FOLDRT = fis.project.getProjectPath();

var fisCompileSettings = (fis.compile || '').settings || {};

module.exports = function (fisRet, fisSettings) {
    
    var I18N_FOLDER = fis.project.getProjectPath(fisSettings.folder || 'i18n');
    var DEFAULT_I18N = fisSettings.defaultI18n || 'default';
    var CONNECTOR = fisSettings.connector || '_';

    /**
     * 转换对象中的文件路径
     * @param  {any} any 任意对象
     * @return {any}     与入参相同
     */
    function urify(any) {
        switch (util.getType(any)) {
            case util.STRING:
                var filePath = '/' + path.relative(PROJECT_FOLDRT, path.resolve(I18N_FOLDER, any))
                                         .replace(/\\/g, '/');
                if (fisRet.src[filePath]) {
                    return fisRet.src[filePath].getUrl(fisCompileSettings.hash, fisCompileSettings.domain);
                }
                return any;
            case util.ARRAY:
                return any.map(urify);
            case util.OBJECT:
                var newObj = {};
                var prop;
                for (prop in any) {
                    if (any.hasOwnProperty(prop)) {
                        newObj[prop] = urify(any[prop]);
                    }
                }
                return newObj;
            default:
                return any;
        }
    }

    // 读取文件夹中的 i18n
    return fs.readdirSync(I18N_FOLDER).filter(function (f) {
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
            out.data = urify(JSON.parse(fs.readFileSync(i18nFilePath, 'utf8')));
        } catch (e) {
            out.data = {};
            console.log(e);
        }
        return out;
    });

};
