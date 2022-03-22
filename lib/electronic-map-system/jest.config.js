/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-26 16:49:30
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 09:50:44
 */

const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname),
    verbose: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coveragePathIgnorePatterns: ["/node_modules/"],
    coverageReporters: ["json", "lcov", "text", "clover"],
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(igu/core/basic|igu|igu/core/utils))",
    ],
    moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node', "scss"],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['<rootDir>/src'],
    // 测试文件
    testMatch: ["<rootDir>/__test__/**/*.(spec|test).(ts|js)?(x)"],
    moduleNameMapper: {
        '\\.(css | scss)$': 'identity-obj-proxy',
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@api/(.*)$": ["<rootDir>/src/api/$1"],
        "^@scss/(.*)$": "<rootDir>/src/scss/$1",
        "^@view/(.*)$": "<rootDir>/src/view/$1",
        "^@images/(.*)$": "<rootDir>/src/images/$1",
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@shared/(.*)$": "<rootDir>/src/shared/$1",
        "^@store/(.*)$": "<rootDir>/src/config/store/$1",
        "^@router/(.*)$": "<rootDir>/src/config/router/$1",
        "^@containers/(.*)$": "<rootDir>/src/containers/$1",
        "^@components/(.*)$": "<rootDir>/src/components/$1"
    },
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\js$': 'babel-jest',
        '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                target: 'esnext'
            }
        }
    }
}