gulp-noder
==========

Gulp plugin for to ease packaging with Noder. Usage:

```javascript
var gulp = require('gulp');
var hsp = require('gulp-hashspace');
var noder = require('gulp-noder');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

gulp.task('package', function () {
    gulp.src('src/**/*.+(hsp|js)')
        .pipe(hsp.process())        //compile and transpile #space files
        .pipe(noder.package('/src'))//wrap CommonJS so they can be loaded with Noder.js
        .pipe(concat('all.min.js')) //combine files together
        .pipe(noder.wrap())         //entire file wrapping needed by Noder.js
        .pipe(uglify())             //minify
        .pipe(gulp.dest('dist'));   //copy to the destination folder
});
```
