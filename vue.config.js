const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    // 基本路径
    baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://rockp.club'
    : '/',
    publicPath: process.env.NODE_ENV === 'production'
    ? './static'
    : './',
    outputDir: 'dist', //打包输出目录默认dist

    //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
    filenameHashing: false,

    //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: true,

    /**
     * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
     *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
     *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
     *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
     * */
    productionSourceMap: false,

    configureWebpack: {
        externals:{
            'AMap': 'AMap'  //高德地图
        }

    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
    },
    // 它支持webPack-dev-server的所有选项
    devServer: {
        host: "192.168.3.51",
        port: 8080, // 端口号
        https: true, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        proxy: {
            "/api": {
                target: "https://rockp.club",
                ws:false,
                secure: false,
                changeOrigin: true,
                pathRewrite:{
                    '^/api':''
                }
            },
            "/amap": {
                target: "https://restapi.amap.com/v3/geocode/regeo",
                ws:false,
                secure: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/ampa':''
                }
            },
        }
    }
}