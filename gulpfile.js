const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')
const tsProject = ts.createProject('./tsconfig.json')
const runSequence = require('run-sequence')
const small = require('small').gulp

gulp.task('bundle', function () {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject()) // Compile typescript to javascript
    .pipe(small('shubox.js', {
      outputFileName: {
        commonjs: 'output.common.js',
        amd: 'output.amd.js',
        standalone: 'output.standalone.js',
        universal: 'output.universal.js'
      },
      exportPackage: {
        universal: 'kek'
      }
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', function () {
  return gulp.src('./src/**/*.ts', { base: '.' })
    .pipe(tsProject())
    .pipe(gulp.dest('.'))
})

gulp.task('test', function () {
  return gulp.src('./spec/**/*.ts', { base: '.' })
    .pipe(tsProject())
    .pipe(gulp.dest('.'))
    .pipe(mocha({
      reporter: 'spec'
    }))
})

gulp.task('default', ['build', 'test'])

gulp.task('watch', () => {
  gulp.watch('./**/*.ts', () => runSequence('build', 'test'))
})
