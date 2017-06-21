const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')
const tsProject = ts.createProject('./tsconfig.json')
const runSequence = require('run-sequence')
const rollup = require('rollup')
const rollupTypescript = require('rollup-plugin-typescript')

gulp.task('bundle', function () {
  return rollup.rollup({
    entry: './src/shubox.ts',
    plugins: [ rollupTypescript() ]
  })
    .then(function (bundle) {
      bundle.write({
        format: 'iife',
        moduleName: 'library',
        dest: './dist/library.js'
      })
    })
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