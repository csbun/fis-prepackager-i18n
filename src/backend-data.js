'use strict';

var path = require('path');
var util = require('./util');

/**
 * 替换成 play 参数
 */
function replacerPlayArg (bd) {
    return '${' + bd.name + '}';
}

/**
 * 替换成 backend-data.json 的内容
 */
function replacerData(bd) {
    return util.isString(bd.data) ? bd.data : JSON.stringify(bd.data, null, 4);
}

module.exports = function (file, isPack) {
    if(file.ignoreBackendData){
		return;
    }
    var backendArgs = [];
    var content = file.getContent();

    // 如果打包，则转义 play 特殊字符
    if (isPack) {
        content = content.replace(/(`|~|@\{|\$\{|\$"|%\{)/g, '~$1');
    }

    try {
        // 强制删除 require(backend-data.js) 的 cache
        var backendDataFile = path.join(file.dirname, 'backend-data.js');
        if (require.cache[backendDataFile]) {
            delete require.cache[backendDataFile];
        }
        // 监听文件变化依赖
        file.cache.addDeps(backendDataFile);
        // 如果打包，则替换成 play 参数
        // 否则替换成 backend-data.json 的内容
        var replacer = isPack ? replacerPlayArg : replacerData;
        // 遍历，替换
        require(backendDataFile).map(function (bd) {
            backendArgs.push('String ' + bd.name);
            var reg = new RegExp('\\b' + bd.placeholder + '\\b', 'g');
            content = content.replace(reg, function () {
                return replacer(bd);
            });
        });
        // 如果打包，添加全部 play 参数
        if (isPack && backendArgs.length) {
            content = '`args ' + backendArgs.join(', ') + '\n' + content;
        }
    } catch (e) {
        console.log(e);
    }
    file.setContent(content);
};
