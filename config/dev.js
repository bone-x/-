// const isH5 = process.env.CLIENT_ENV === 'h5'
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {
    // https://webpack.js.org/configuration/dev-server/#devserverproxy
    devServer: {
      proxy: {
        '/hjBaseUrl': {
          target: 'http://10.0.98.187:10030/expert',
          // target: 'http://10.0.87.220:5672          ',
          pathRewrite: {
            '^/hjBaseUrl': ''
          },
          changeOrigin: true
        },
        '/authBaseUrl': {
          target: 'http://hangjiah5.beta.hqjy.com',
          pathRewrite: {
            '^/authBaseUrl': ''
          },
          changeOrigin: true
        },
        '/ljBaseUrl': {
          target: 'http://lctesthangjia.beta.hqjy.com',
          pathRewrite: {
            '^/ljBaseUrl': ''
          },
          changeOrigin: true
        }
      }
    }
  }
}
