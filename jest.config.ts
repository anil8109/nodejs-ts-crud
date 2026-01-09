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
    "!src/modules/**/routes/*.ts",
    "!src/modules/**/repository/*.ts"
  ],

  coverageThreshold: {
    global: {
    branches: 30,
    functions: 75,
    lines: 65,
    statements: 63,
    }
  }
};

export default config;
