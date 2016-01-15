'use strict';

var UNIT_REG = /\{\{\{unit(?=\s)([^}]+)\}\}\}/g;
var UNIT_NAME_REG = /\sname\s*=\s*"([^"]+)"/;
var UNIT_DATA_REG = /\sdata\s*=\s*"([^"]+)"/;

var path = require('path');
var util = require('./util');
var wrapError = require('./wrap-error');
var backendData = require('./backend-data');

/**
 * 组装 components
 */
module.exports = function (file, fisRet, fisSetting, fisOpt) {
    var content = file.getContent();
    // 组装 components
    content = content
        // 替换 Layout 中的 组件单元
        .replace(UNIT_REG, function (m) {
            var name, data;
            m = m.replace(UNIT_NAME_REG, function (mm, $$1) {
                name = $$1;
                return '';
            });
            // TODO: data 暂时还没有用到
            m = m.replace(UNIT_DATA_REG, function (mm, $$1) {
                data = $$1;
                return '';
            });
            if (name) {
                // 找到组件
                var cmpFilePath = path.join(file.subdirname, '../../', '/components/' + name + '/' + name + '.html');
                console.log(cmpFilePath);
                var cmpFile = fisRet.src[cmpFilePath];
                if (cmpFile) {
                    m = cmpFile.getContent();
                } else {
                    m = wrapError('component ' + name + ' NOT found!');
                }
            } else {
                m = '<!-- ' + m + ' -->';
            }
            return m;
        });
    file.setContent(content);

    // 替换 BACKEND_DATA
    // scart 中直接使用 -p 参数表示打包
    var isPack = fisOpt.pack;
    // fis3 中使用 media === 'prod' 表示生产模式
    if (util.getType(fis.media) === util.FUNCTION) {
        var media = fis.media() || {};
        if (media._media === 'prod') {
            isPack = true;
        }
    }
    backendData(file, isPack);
    
    // 文件更新到 release 目录
    fisOpt.beforeCompile(file);
};
