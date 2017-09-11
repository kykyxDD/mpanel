'use strict';
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
// var templateCache = require('gulp-templatecache');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngannotate = require('gulp-ng-annotate');
var closure = require('gulp-jsclosure');
var p = require('path');

var paths = {
  javascripts: [
    './src/js/app.js',
    /*
     * this file should not be commited to git, you write HTML!
     * it should also not beeing watched by gulp if it then triggers a change
     * or gulp will be left in an infinite loop (see below)
     */
    './src/js/templates.js',
    './src/**/*.js',
    './src/**/**/*.js'
  ],
  templates: [
    './html/*.html'
  ]
}


gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('template_cache', function(){
	return gulp.src(paths.templates)
   .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache({
      module: 'mpanelApp',
      // standalone: true,
     
      transformUrl: function(url) {
        return url.replace(p.extname(url), '.html')
      }
    }))
    //put all those to our javascript file
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./script_angular'))
})
