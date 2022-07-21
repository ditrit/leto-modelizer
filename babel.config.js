/* eslint-disable */

module.exports = api => {
  return {
    presets: [
      '@babel/preset-env',
      [
        '@quasar/babel-preset-app',
        api.caller(caller => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {}
      ]
    ]
  }
}
