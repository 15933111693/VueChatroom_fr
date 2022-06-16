const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  pwa: {
    name: 'easy-front-vue-cli3',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },

  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import "@/variable.scss";`
      }
    }
  },

  // devServer: {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, './cert/privatekey.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, './cert/certificate.pem'))
  //   }
  // }
})
