var gulp = require('gulp');
var karma = require('karma').server;
var karmaConf = require('./karma.conf');
var _ = require('lodash');

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaConf, {singleRun: true}), done);
});

/**
 * Watch for file changes and re-run tests on each change
 */

gulp.task('tdd', function (done) {
  karma.start(karmaConf, done);
});

gulp.task('default', ['tdd']);
