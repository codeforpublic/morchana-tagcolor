module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'service-worker.js'
    }
  },
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/'
    : '/'
}
