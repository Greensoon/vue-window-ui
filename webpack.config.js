var path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCss = require('mini-css-extract-plugin');
// const webpack = require('webpack');

// const HappyWebpack = require('happypack')

var lessExt = new MiniCss({
    filename: 'css/[name].[hash:6].css'
})
module.exports = {
    entry: {
        app: ['babel-polyfill', './src/main.js'],
        vendor: [
            'vue',
            'vuex',
            'vue-router',
            'element-ui',
        ],
        other: [
            'v-charts',
            'echarts',
            'axios',
            'sortablejs',
            'interactjs'
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            pages: path.join(__dirname, '/src/pages'),
            assetImg: path.join(__dirname, '/assets/img'),
            component: path.join(__dirname, '/src/components'),
            utils: path.join(__dirname, '/src/utils'),
            vue: 'vue/dist/vue.common.js',
        }
    },
    externals: {
        jQuery: 'window.jQuery'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
        },
        // runtimeChunk: {
        //     name: entrypoint => entrypoint.name
        // }
    },
    plugins: [
        new VueLoaderPlugin(),
        lessExt,
    ],
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            loader: 'eslint-loader',
            query: {
                esModules: true
            },
            exclude: [path.join(__dirname, './src/lib')]
        }, {
            test: /\.vue$/,
            use: [
                'thread-loader',
                'vue-loader'
            ]
        }, {
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory=true',
            options: {
                presets: ["@babel/preset-env"]
            },
            exclude: /node_modules/
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader?limit=10000&name=[path][name].[ext]'
        }, {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        }, {
            test: /\.less$/,
            use: [MiniCss.loader, 'css-loader', 'less-loader' ]
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        }]
    }
}