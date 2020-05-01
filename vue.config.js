const TerserPlugin = require('terser-webpack-plugin');
const isProduction = process.env.NODE_ENV !== 'development'; // 是否生产环境
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // gzip压缩

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
let publicPath = '/'

module.exports = {
  publicPath, // 根据你的实际情况更改这里
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    // 这个请求被转发到了百度云服务器上，方便开发，百度云的nginx已经修改过了
    // proxy: {
    //   '/api': {
    //     target: 'https://106.13.160.74/api',
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    // 如果需要自己开发后台，上面注释掉换成下面这个
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000/api',
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    publicPath // 和 publicPath 保持一致
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        data: `@import '~@/assets/style/public.scss';`
      }
    }
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    config
    // 开发环境
      .when(process.env.NODE_ENV === 'development',
        // sourcemap不包含列信息
        config => config.devtool('cheap-source-map')
      )
      // 非开发环境
      .when(process.env.NODE_ENV !== 'development', config => {
        config.optimization
          .minimizer([
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log'],
                  warnings: false,
                },
              }
            })
          ])
      })
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // i18n
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
    // svg
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
    // node
    config.node
      .set('__dirname', true)
      .set('__filename', true)
    // 判断环境加入模拟数据
    // const entry = config.entry('app')
    // if (process.env.VUE_APP_BUILD_MODE !== 'nomock') {
    //   entry
    //     .add('@/mock')
    //     .end()
    // }
  },
  configureWebpack: config => {
    // 生产环境相关配置
    if (isProduction) {
        // gzip压缩
        const productionGzipExtensions = ['html', 'js', 'css'];
        config.plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' + productionGzipExtensions.join('|') + ')$'
                ),
                threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: true // 删除原文件
            })
        );
        // 公共代码抽离
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        test: /node_modules/,
                        name: 'vendor',
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 100
                    },
                    common: {
                        chunks: 'all',
                        test: /[\\/]src[\\/]js[\\/]/,
                        name: 'common',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 60
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true
                    },
                    runtimeChunk: {
                        name: 'manifest'
                    }
                }
            }
        }
    }
  }
};
