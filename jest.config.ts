import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  testMatch: ["**/src/modules/**/*.test.ts"],

  transform: {
    "^.+\\.ts$": "ts-jest"   // ⬅️ required fix
  },

  moduleFileExtensions: ['ts', 'js', 'json'],

  collectCoverage: true,
  collectCoverageFrom: [
    "!src/server.ts",
    "!src/app.ts",
  ],

  coverageThreshold: {
  global: {
    statements: 100,
    lines: 100,
    functions: 100,
    branches: 100
  }
}
};

export default config;
