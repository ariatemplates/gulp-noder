var through = require('through2');
var findRequires = require('noder-js/findRequires');
var moduleFunction = String(require('noder-js/context').prototype.jsModuleEval("$CONTENT$"));
var path = require('path');

module.exports.package = function (basePath) {

    return through.obj(function (file, encoding, done) {
        var fileContent = String(file.contents);
        var requires = findRequires(fileContent, true);
        var filePath = path.relative(__dirname + '/../..' + (basePath || ''), file.path).replace(/\\/g, '/');
        file.contents = new Buffer(['define(', JSON.stringify(filePath), ', ', JSON.stringify(requires) + ', ',
                moduleFunction.replace("$CONTENT$", fileContent), ');'].join(''));
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

module.exports.version = require('noder-js/package.json').version;
