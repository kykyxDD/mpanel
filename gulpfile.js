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

  ],
  controller: [
    // знаю что можно /controllers/*.js , а так они строят по очереди страницек )

    './script_angular/controllers/homeController.js',
    './script_angular/controllers/userController.js',
    './script_angular/controllers/projectController.js',
    './script_angular/controllers/fabricController.js',
    './script_angular/controllers/fittingController.js',
    './script_angular/controllers/shapeController.js',
    './script_angular/controllers/reviewController.js',
    './script_angular/controllers/seamsController.js',
    './script_angular/controllers/patternController.js'
  ],
  directive: [
    './script_angular/directive/*.js'
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
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./script_angular'))
});
gulp.task('controllers',function(){
  return gulp.src(paths.controller)
    .pipe(concat('allControllers.js'))
    .pipe(gulp.dest('./script_angular'))
});
gulp.task('directive',function(){
  return gulp.src(paths.directive)
    .pipe(concat('allDirective.js'))
    .pipe(gulp.dest('./script_angular'))
})

gulp.task('watcher', function(){
  gulp.watch(paths.templates, ['template_cache']);
})
