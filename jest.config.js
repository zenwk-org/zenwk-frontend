module.exports = {
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
