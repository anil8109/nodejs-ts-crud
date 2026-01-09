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
    statements: 60,
    lines: 60,
    functions: 76,
    branches: 33
  }
}
};

export default config;
