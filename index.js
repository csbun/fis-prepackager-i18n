'use strict';

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var PROJECT_DIR = fis.project.getProjectPath();

/**
 * 读取 i18n 数据
 * @return {Object}      i18n 数据
 */
var getI18nData = function (file, conf) {
    var I18N = conf.i18n || 'i18n';
    var I18N_FOLDER = conf.folder || 'i18n';
    var I18N_FILE_PATH = path.join(PROJECT_DIR, I18N_FOLDER, I18N + '.json');
    try {
        file.cache.addDeps(I18N_FILE_PATH);
        return JSON.parse(fs.readFileSync(I18N_FILE_PATH, 'utf8'));
    } catch (e) {
        console.error(e.message);
        return {};
    }
};

/**
 * 将错误信息输出为 html 片段
 * @param  {Error} err 错误信息
 * @return {string}    html 片段
 */
var wrapError = function (err) {
    var html = '<div style="color:red">';
    html += '<h2>' + (err.message || err) + '</h2>';
    if(err.stack){
        html += '<pre>' + err.stack + '</pre>';
    }
    html += '</div>';
    return html;
};

module.exports = function (content, file, conf) {
    // 读取 i18n 数据
    var i18nData = getI18nData(file, conf);
    // 渲染 ejs 数据
    try {
        content = ejs.render(content, i18nData);
    } catch (e) {
        wrapError(e);
    }
    return content;
};
