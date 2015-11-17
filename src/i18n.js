'use strict';

var path = require('path');
var ejs = require('ejs');
var wrapError = require('./wrap-error');
var util = require('./util');

/**
 * 生成 i18n 文件路径
 * @param  {string} filePath      源文件路径
 * @param  {object} i18nObj       i18n 数据对象
 * @return {string}               新的文件路径
 */
function getI18nFilePath (filePath, i18nObj) {
    if (util.isString(filePath)) {
        var pathObj = {
            dir: path.dirname(filePath),
            ext: path.extname(filePath),
        };
        pathObj.name = path.basename(filePath, pathObj.ext);
        // var pathObj = path.parse(filePath);
        return path.join(pathObj.dir, pathObj.name + i18nObj.connector + i18nObj.i18n + pathObj.ext)
                    .replace(/\\/g, '/');
    } else {
        return filePath;
    }
}


/**
 * 产生多个语言的文件
 */
module.exports = function (file, i18nArr, fisRet) {

    var defaultI18nContent;

    // 读取文件夹中的 i18n
    i18nArr.map(function (i18nObj) {
        // 读取 i18n 的 josn 内容
        var content = '';
        try {
            // 监听依赖
            file.cache.addDeps(i18nObj.file);
            // 用 ejs 渲染
            content = ejs.render(file.getContent(), i18nObj.data);
        } catch (e) {
            content = wrapError(e);
            if (!/<body>/.test(content)) {
                content = '<html><body>' + content + '</body></html>';
            }
        }
        // 如果当前语言是默认语言，则暂存
        if (i18nObj.isDefault) {
            defaultI18nContent = content;
        }
        // 生成新的文件
        var fileWithI18n = fis.file(getI18nFilePath(file.fullname, i18nObj));
        fileWithI18n.setContent(content);

        // 复制 release 属性
        fileWithI18n.release = getI18nFilePath(file.release, i18nObj);
        // 加入打包目录中
        fisRet.pkg[fileWithI18n.subpath] = fileWithI18n;
    });

    // 重置内容为默认语言内容
    if (defaultI18nContent) {
        file.setContent(defaultI18nContent);
    }
};

