// Configuración Jest para soportar TypeScript, React y alias de módulos
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",

    collectCoverage: true,
    coverageDirectory: "coverage",

    // Detecta archivos de pruebas correctamente
    testMatch: ["**/__tests__/**/*.(test|spec).(js|ts|tsx)"],

    // Asegura que Jest sepa qué extensiones buscar (redundante pero útil en CI)
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // Transformaciones necesarias para TSX/JSX
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "babel-jest",
            {
                configFile: "./babel-jest.config.js",
            },
        ],
    },

    // ★★ Alias Optimizados para CI (moduleNameMapper) ★★
    // Se eliminan los anclajes ^ y $ para mayor flexibilidad en la ruta absoluta de CI
    moduleNameMapper: {
        // Alias generales sin anclajes (flexible)
        "@app/(.*)": "<rootDir>/src/$1",
        "@auth/(.*)": "<rootDir>/src/app/(modules)/(auth)/$1",

        // ALIAS DE @USER (SOLUCIÓN AL ERROR DE RESOLUCIÓN):
        // 1. Patrón base para importaciones sin extensión (ej: '@user/utils/...')
        "@user/(.*)": "<rootDir>/src/app/(modules)/user/$1",

        // 2. Patrón que captura y fuerza la resolución de archivos .ts o .tsx
        // Esto obliga a Jest a probar la extensión y resuelve el conflicto en Linux.
        "@user/(.*)\\.(ts|tsx)$": "<rootDir>/src/app/(modules)/user/$1.$2",
    },

    // Configuración adicional para Jest DOM
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
