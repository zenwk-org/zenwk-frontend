// jest.setup.ts
import "@testing-library/jest-dom";

// JSDOM no implementa URL.createObjectURL.
// En tests se debe mockear manualmente.
// @ts-ignore
global.URL.createObjectURL = jest.fn(() => "mock-preview-url");

// @ts-ignore
global.URL.revokeObjectURL = jest.fn();
