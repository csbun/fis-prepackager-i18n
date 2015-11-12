'use strict';

var UNIT_REG = /\{\{\{unit(?=\s)([^}]+)\}\}\}/g;
var UNIT_NAME_REG = /\sname\s*=\s*"([^"]+)"/;
var UNIT_DATA_REG = /\sdata\s*=\s*"([^"]+)"/;

var BACKEND_DATA = fis.config.get('backend.data');
var BACKEND_DATA_REG = BACKEND_DATA.reg;
var BACKEND_DATA_IMPORT = '`args String ' + BACKEND_DATA.server + '\n';
var BACKEND_DATA_ARG = '${' + BACKEND_DATA.server + '}';

var wrapError = require('./wrap-error');

/**
 * 组装 components
 */
module.exports = function (file, fisRet, fisSetting, fisOpt) {
    var content = file.getContent();
    var needBackendImport = false;
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
                var cmpFilePath = '/components/' + name + '/' + name + '.html';
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
    // 如果 -p 打包，则转义 play 特殊字符
    if (fisOpt.pack) {
        content = content.replace(/(`|~|@\{|\$\{|%\{)/g, '~$1');
    }
    // 替换 BACKEND_DATA
    content = content.replace(BACKEND_DATA_REG, function () {
            if (fisOpt.pack) {
                // 如果 -p 打包，则替换成 play 参数
                needBackendImport = true;
                return BACKEND_DATA_ARG;
            } else {
                // 否则替换成 backend-data.json 的内容
                var mockBackendData = {};
                var backendDataFilePath = file.subdirname + '/backend-data.json';
                try {
                    mockBackendData = JSON.parse(fisRet.src[backendDataFilePath].getContent());
                } catch (e) {}
                return JSON.stringify(mockBackendData, null, 4);
            }
        });
    if (needBackendImport) {
        content = BACKEND_DATA_IMPORT + content;
    }
    // 保存内容
    file.setContent(content);
};
