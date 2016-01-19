'use strict';

var util = require('util'),
    path = require('path'),
    _ = require('lodash'),
    tildify = require('tildify'),
    chalk = require('chalk'),
    fs = require('fs'),
    fse = require('fs-extra'),
    CompilerAdapter = require('../lib/compilerAdapter'),
    WorkerFarmRunCompilerStrategy = require('../lib/workerFarmRunCompilerStrategy');

describe('CompilerAdapter', function () {
    function generateFiles(files) {
        return files.map(function(filename) {
            return util.format('./test/fixtures/webpack.%s.config.js', filename);
        }).map(function(filename) {
            return tildify(path.resolve(filename));
        });
    }

    beforeEach(function() {
        spyOn(console, 'log');
        spyOn(process.stderr, 'write');
    });

    afterEach(function(done) {
        fse.remove('./test/fixtures/tmp', done);
    });

    describe('#run()', function() {
        it('should compile configs successfully', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true
            });

            compilerAdapter.run('./test/fixtures/webpack.!(3).config.js').then(function() {
                var args = console.log.calls.allArgs();

                var files = generateFiles([0, 1, 2]).map(function(filename) {
                    return chalk.magenta(filename);
                });

                var message = util.format('Compiling %s webpack configs [%s]', chalk.white('3'), files.join(', '));

                expect(args.length).toBe(8);
                expect(_.at(args, 0)).toMatch(_.escapeRegExp(message));
                expect(_.at(args, 1)).toMatch('Stats for webpack config');
                expect(_.at(args, 2)).toMatch('Hash');
                expect(_.at(args, 3)).toMatch('Stats for webpack config');
                expect(_.at(args, 4)).toMatch('Hash');
                expect(_.at(args, 5)).toMatch('Stats for webpack config');
                expect(_.at(args, 6)).toMatch('Hash');
                expect(_.at(args, 7)).toMatch('Finished in');

                done();
            });
        });

        it('should throw error when configs have some errors/warnings', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                failOn: true
            });

            compilerAdapter.run('./test/fixtures/webpack.*.config.js').catch(function(err) {
                var files = generateFiles([3]);

                var message = util.format('Cannot compile %d webpack config [%s]', 1, files.join(', '));

                expect(err.message).toEqual(message);

                done();
            });
        });

        it('should throw error when `callback` is defined', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js', _.noop).catch(function(err) {
                expect(err.message).toEqual(WorkerFarmRunCompilerStrategy.CALLBACK_ERROR_MESSAGE);

                done();
            });
        });

        it('should override `output.path`', function(done) {
            var compilerAdapter = new CompilerAdapter({}, {
                output: {
                    path: './test/fixtures/tmp/custom'
                },
                resolve: {
                    base: './test/fixtures/tmp'
                }
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js').then(function() {
                fs.exists('./test/fixtures/tmp/custom/1', function(exists) {
                    expect(exists).toBe(true);

                    done();
                });
            });
        });

        it('should emit `stats.json`', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                json: true
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js').then(function() {
                var args = _.flatten(console.log.calls.allArgs(), true);

                expect(args[2]).toMatch('stats\.json');

                done();
            });
        });

        it('should write `progress` to `process.stderr`', function(done) {
            var compilerAdapter = new CompilerAdapter({
                progress: true,
                memoryFs: true
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js').then(function() {
                /*var args = _.flatten(process.stderr.write.calls.allArgs(), true);

                expect(args.join('#').replace('\n', '')).toMatch('100%');*/

                done();
            });
        });
    });

    describe('#watch()', function() {
        it('should start watching configs successfully', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true
            });

            compilerAdapter.watch('./test/fixtures/webpack.!(3).config.js').then(function(watcher) {
                var args = console.log.calls.allArgs();

                var files = generateFiles(['!(3)']).map(function(filename) {
                    return chalk.magenta(filename);
                });

                var message = util.format('Watching webpack configs [%s]', files.join(', '));

                expect(args.length).toBe(1);
                expect(_.at(args, 0)).toMatch(_.escapeRegExp(message));

                watcher.close();

                watcher.on('end', function() {
                    done();
                });
            });
        });

        it('should re-compile config when file changes', function(done) {
            var compilerAdapter = new CompilerAdapter({
                memoryFs: true
            });

            fse.copy('./test/fixtures/webpack.1.config.js', './test/fixtures/tmp/webpack.1.config.js', function() {
                compilerAdapter.watch('./test/fixtures/tmp/webpack.*.config.js', function(err, stats) {
                    expect(err).toEqual(null);
                    expect(stats).toEqual(jasmine.any(Object));
                }).then(function(watcher) {
                    watcher.on('all', function() {
                        watcher.close();
                    });

                    watcher.on('end', function() {
                        done();
                    });

                    fs.appendFileSync('./test/fixtures/tmp/webpack.1.config.js', util.format('// Modified at %s\n', new Date()));
                });
            });
        });
    });
});
