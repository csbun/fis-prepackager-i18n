'use strict';

var htmlify = function (str) {
    return (str || '')
        .toString()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

/**
 * 将错误信息输出为 html 片段
 * @param  {Error} err 错误信息
 * @return {string}    html 片段
 */
module.exports = function (err) {
    var html = '<div style="color:red">';
    html += '<pre style="font-weight: bold; font-size: larger;"><code>' +
            htmlify(err.message || err) + '</code></pre>';
    if(err.stack){
        html += '<pre><code>' + htmlify(err.stack) + '</code></pre>';
    }
    html += '</div>';
    return html;
};
