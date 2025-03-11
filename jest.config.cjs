module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    "node_modules/(?!(nanoid)/)"
  ],
  testEnvironment: 'node'
};
