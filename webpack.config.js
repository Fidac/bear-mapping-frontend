var HtmlWebpackPlugin = require('html-webpack-plugin');
// var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                // exclude: /node_modules/
            },
            {
                test: /\.(scss|css)$/,
                // include: ["./node_modules/antd/dist/antd.css"],
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                    },
                ]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',}),
    ],
    devServer: {
        historyApiFallback: true
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:8082'
        })
    }
}
