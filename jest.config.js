// Configuración Jest para soportar TypeScript, React y alias de módulos
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",

    collectCoverage: true,
    coverageDirectory: "coverage",

    // Detecta archivos de pruebas correctamente
    testMatch: ["**/__tests__/**/*.(test|spec).(js|ts|tsx)"],

    // Transformaciones necesarias para TSX/JSX
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "babel-jest",
            {
                configFile: "./babel-jest.config.js",
            },
        ],
    },

    // ★★ Alias corregidos según tsconfig.json ★★
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // ★★ Alias de Módulos (Sin anclajes ^ y $ para mayor flexibilidad en CI) ★★
    moduleNameMapper: {
        "@app/(.*)": "<rootDir>/src/$1",
        "@auth/(.*)": "<rootDir>/src/app/(modules)/(auth)/$1",
        "@user/(.*)": "<rootDir>/src/app/(modules)/user/$1",
    },

    // Configuración adicional para Jest DOM
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
