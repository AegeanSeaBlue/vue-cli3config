module.exports = {
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production'
        } else {
            config.mode = 'development'
        }
        Object.assign(config, {
            resolve: {
                alias: {
                    '@': __dirname + '/src/',
                },
                extensions: ['*', '.js', '.vue', '.json']
            },
        })
    },
    productionSourceMap: false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        historyApiFallback: true,
        noInfo: true,
        /*host: "192.168.2.97",   //填写你自己的IP地址
        port: 8081,   //填写刚刚在dev字段中找到的port端口号
        progress: true,*/
        //配置代理
        proxy: {

            '/api': {
                target: 'http://192.168/',
                secure: false,
                changeOrigin: true
            }
        }
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    }
};
