module.exports = {    context: __dirname + '/js',    entry: './ddr.js',    output: {        path: __dirname,        filename: 'bundle.js'    },    module: {        loaders: [            {                loader: 'babel-loader',                exclude: /node_modules/,                query: {                    presets: ['@babel/preset-env']                }            }        ]    },    devtool: 'source-map',    watch: true};