module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    testMatch: ["**/__tests__/**/*.(test|spec).(js|ts|tsx)"],
};
