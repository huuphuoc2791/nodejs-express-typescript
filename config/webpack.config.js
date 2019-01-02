const root = require('app-root-path').path;

module.exports = {
    entry: `${root}/bin/server.ts`,
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [
        /^[a-z\-0-9]+$/, // Ignore node_modules folder
    ],
    output: {
        filename: 'server', // output file
        path: `${root}/build`,
        libraryTarget: 'commonjs',
    },
    resolve: {
        // Add in `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: [
            `${root}/node_modules`,
            'node_modules',
        ],
    },
    resolveLoader: {
        //root: [`${root}/node_modules`],


    },
    module: {
        rules: [{
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader',
                },
            ],
        }],
    },
};