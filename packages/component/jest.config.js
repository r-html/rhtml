module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov', 'html'],
  rootDir: './',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  globals: {
    __DEV__: true
  },
  transform: {
    '\\.(ts|tsx)$': 'ts-jest'
  },
  testRegex: '/src/.*\\.spec.(ts|tsx|js)$',
  verbose: true,
  collectCoverage: true
};
