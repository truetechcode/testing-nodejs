const path = require('path');

module.exports = {
  collectCoverageFrom: ['**/src/**/*.js'],
  coverageDirectory: path.join(__dirname, './coverage/collective'),
  coveragePathIgnorePatterns: ['.*/__tests/.*'],
  roots: [path.join(__dirname, './src')],
  rootDir: path.join(__dirname, '.'),
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**'],
};
