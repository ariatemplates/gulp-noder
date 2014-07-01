var through = require('through2');
var findRequires = require('noder-js/findRequires');
var path = require('path');

module.exports.package = function (basePath) {

    return through.obj(function (file, encoding, done) {
        var fileContent = String(file.contents);
        var requires = findRequires(fileContent);
        var requiresStr = requires.length ? '"' + requires.join('", "') + '"' : '';
        var filePath = path.relative(__dirname + '/../..' + (basePath || ''), file.path);
        file.contents = new Buffer([
            '\tdefine("' + filePath + '", [' + requiresStr + '], function(module, global) {',
            '\t\tvar require = module.require, exports = module.exports, __filename = module.filename, __dirname = module.dirname;',
            fileContent,
            '\t});'].join('\n'));

        this.push(file);
        done();
    });
};

module.exports.wrap = function () {

    return through.obj(function (file, encoding, done) {
        file.contents = new Buffer('(function(define) {\n' + String(file.contents) + '\n})(noder.define);')
        this.push(file);
        done();
    });
};
