'use strict';

var util = require('./util');

// 如果 -p 打包且指定了 packRelease，则替换 release 路径
module.exports = function (file, fisOpt) {
    if (fisOpt.pack && file.hasOwnProperty('packRelease')) {
        file.release = file.packRelease;
        if (util.isString(file.release)) {
            file.release = file.release.replace(/\.(less|scss|sass)$/, '.css');
        }
    }
};
