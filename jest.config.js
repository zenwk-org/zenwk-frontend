// Configuración Jest para soportar TypeScript, React y alias de módulos
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",

    collectCoverage: true,
    coverageDirectory: "coverage",

    // Detecta archivos de pruebas correctamente
    testMatch: ["**/tests/**/*.(test|spec).(js|ts|tsx)"],

    // Transformaciones necesarias para TSX/JSX
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "babel-jest",
            {
                configFile: "./babel-jest.config.js",
            },
        ],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        // Alias específicos de tu tsconfig
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^@styles/(.*)$": "<rootDir>/src/styles/$1",
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@tests/(.*)$": "<rootDir>/src/tests/$1",
        // Módulos
        "^@modules/auth/(.*)$": "<rootDir>/src/components/modules/auth/$1",
        "^@modules/user/(.*)$": "<rootDir>/src/components/modules/user/$1",
        // UI/Shared
        "^@ui/(.*)$": "<rootDir>/src/components/ui/$1",
        "^@shared/(.*)$": "<rootDir>/src/components/shared/$1",
    },

    // Configuración adicional para Jest DOM
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
