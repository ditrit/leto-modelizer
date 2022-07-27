const esModules = ['quasar', 'quasar/lang', 'lodash-es'].join('|');

module.exports = {
  globals: {
    __DEV__: true,
    // TODO: Remove if resolved natively
    // See https://github.com/vuejs/vue-jest/issues/175
    'vue-jest': {
      pug: { doctype: 'html' },
    },
  },
  // Jest assumes we are testing in node environment, specify jsdom environment instead
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  // noStackTrace: true,
  // bail: true,
  // cache: false,
  // verbose: true,
  // watch: true,
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.js',
  ],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^quasar$': 'quasar/dist/quasar.esm.prod.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^boot/(.*)$': '<rootDir>/src/boot/$1',
    '.*css$': '@quasar/quasar-app-extension-testing-unit-jest/stub.css',
  },
  transform: {
    '.*\\.vue$': '@vue/vue3-jest',
    '.*\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    // use these if NPM is being flaky, care as hosting could interfere with these
    // '.*\\.vue$': '@quasar/quasar-app-extension-testing-unit-jest/node_modules/vue-jest',
    // '.*\\.js$': '@quasar/quasar-app-extension-testing-unit-jest/node_modules/babel-jest'
  },
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coverageDirectory: './reports',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{vue,js,jsx}',
  ],
  // Needed in JS codebases too because of feature flags
  coveragePathIgnorePatterns: ['/node_modules/', '.d.ts$'],
  coverageThreshold: {
    global: {
      //  branches: 50,
      //  functions: 50,
      //  lines: 50,
      //  statements: 50
    },
  },
  coverageReporters: ['lcov', 'cobertura', 'text-summary', 'text'],
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
  snapshotSerializers: ['jest-serializer-vue'],
};
