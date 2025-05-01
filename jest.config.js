module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.spec.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/'],
    verbose: true,
    transform: {},
};
