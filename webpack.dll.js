
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        vendor: [
            'vue/dist/vue.js',
            'vue-router',
            'vuex',
            'element-ui',
        ],
        other: [
            'axios',
            'v-charts',
            'sortablejs',
            'interactjs'
        ]
    },
    mode: 'development',
    output: {
        path: path.join(__dirname, './dll'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CleanWebpackPlugin(path.join(__dirname, './dll')),
        new webpack.DllPlugin({
            path: path.join(__dirname, './dll/[name]-manifest.json'),
            name: '[name]_library'
        })
    ]
}