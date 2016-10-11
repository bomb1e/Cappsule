var gulp = require('gulp') ;
var sass = require('gulp-sass') ;

gulp.task('sass', function() {
    gulp.src('app/styles/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/styles/css/'));
    if(!sass.logError) console.log("finished piping");
});

gulp.task('default', function() {
  gulp.watch('app/styles/sass/*.sass',['sass']);
  console.log('watching');
}) ;
