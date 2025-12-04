module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",

    collectCoverage: true,
    coverageDirectory: "coverage",

    testMatch: ["**/__tests__/**/*.(test|spec).(js|ts|tsx)"],

    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "babel-jest",
            { configFile: "./babel-jest.config.js" },
        ],
    },

    moduleNameMapper: {
        "^@app/(.*)$": "<rootDir>/src/$1",

        // RUTA CORRECTA SIN PARÉNTESIS DUPLICADOS
        "^@auth/(.*)$": "<rootDir>/src/app/(modules)/auth/$1",

        // Alias user válido en Linux + CI
        "^@user/(.*)$": "<rootDir>/src/app/(modules)/user/$1",
    },

    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
