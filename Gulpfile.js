var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean');

    //JSHint task
gulp.task('lint', function(){
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

//browserify task
gulp.task('browserify', function(){
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  //Bundle One file
  .pipe(concat('bundle.js'))
  //Output to dist folder
  .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', ['lint'], function(){
  //watch scripts
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],['lint', 'browserify']);
});

//Views task
gulp.task('views', function(){
  gulp.src('./app/index.html')
  .pipe(gulp.dest('dist/'));
  //All view files
  gulp.src('./app/views/**/*')
  .pipe(gulp.dest('dist/views/'))
  .pipe(refresh(lrserver)); //lrserver refreshing
});

gulp.watch(['app/index.html', 'app/views/**/*.html'], ['views']);


//SERVER CREATION
var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

var server = express();
//live reload
server.use(livereload({port: livereloadport}));
//Dist folder is Root
server.use(express.static('./dist'));
server.all('/*', function(req, res){
  res.sendFile('index.html', {root: 'dist'});
});

//Dev task
gulp.task('serve', function(){
  //start webserver
  server.listen(serverport);
  //Start live reload
  lrserver.listen(livereloadport);
  //watching for changes
  gulp.run('watch');
});

//SASS STUFF
var sass = require('gulp-sass');
//This is for adding browser prefixes for all browsers
var autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', function(){
  gulp.src('app/styles/*.scss')
  //Stops Gulp from crashing on SASS error
  .pipe(sass({onError: function(e){
    console.log(e);
  } }))
  //autoprefixer
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  .pipe(gulp.dest('dist/css/'))
  .pipe(refresh(lrserver));
});

gulp.watch(['app/styles/**/*/*.scss'], ['styles']);
