const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      const vueDefineArgs = args[0];
      vueDefineArgs['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false;
      return args;
    });
  },
  transpileDependencies: true
})
