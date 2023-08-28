const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],

    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'mjs'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.mjs$': '$1'
    }
};

export default config;