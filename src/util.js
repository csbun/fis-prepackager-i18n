'use strict';

var STRING = exports.STRING = 'string';
exports.ARRAY = 'array';
exports.OBJECT = 'object';

/**
 * 获取对象的类型
 * @param {any} obj - 被检查的对象
 */
var getType = exports.getType = function (obj) {
    var type;
    if (obj == null) {
        type = String(obj);
    } else {
        type = Object.prototype.toString.call(obj).toLowerCase();
        type = type.substring(8, type.length - 1);
    }
    return type;
};

exports.isString = function (any) {
    return getType(any) === STRING;
};

