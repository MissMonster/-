const path =  require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    devServer: {
        contentBase:'src',
        open: true,
        publicPath: '/',
        historyApiFallback: true,
        // host: '192.168.3.109',
        port: 8080, 
        proxy: {
            '/User': { 
                target: 'http://115.29.230.26:8888',
                secure: true, 
                changeOrigin: true
            },
            '/Falicity': { 
                target: 'http://115.29.230.26:8888',// 你接口的域名
                secure: true,  // 如果是https接口，需要配置这个参数
                changeOrigin: true// 如果接口跨域，需要进行这个参数配置
            }
        },
        // hot: true
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module:{
        rules:[
            {
                test: /\.css$/,
                include: /node_modules/,
                    use: [
                        {loader:'style-loader'},
                        {loader: 'css-loader', options: {modules:false}
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                    use: [
                        {loader:'style-loader'},
                        {loader: 'css-loader', options: {modules:true}
                    }
                ]
            },
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {test:/\.(gif|jpg|png)$/,use:'url-loader?limit=3000&name=[hash:8]-[name].[ext]'},
            {test:/\.jsx?$/,use:'babel-loader',exclude:/node_modules/},
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
        ]
    }
}
