export default wallaby => {
    return {
        files: [
            'package.json',
            'src/*.js',
            'test/**/*.js',
            '!test/**/*.spec.js'
        ],
        tests: [
            'test/*.spec.js'
        ],
        testFramework: 'jasmine',
        env: {
            type: 'node'
        },
        compilers: {
            '**/*.js': wallaby.compilers.babel({
                babelrc: true
            })
        },
        workers: {
            recycle: true
        },
        hints: {
            ignoreCoverage: /istanbul ignore next/
        },
        setup: () => {
            require('./test/helpers/СlusterModule');
        }
    };
};
