/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-26 16:49:30
 * @LastEditors  : Pat
 * @LastEditTime : 2022-05-09 11:02:24
 */

const path = require('path');
console.log(path.resolve(__dirname, '../'));
module.exports = {
	rootDir: path.resolve(__dirname, '../'),
	verbose: true,
	clearMocks: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	coveragePathIgnorePatterns: ['/node_modules/'],
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	transformIgnorePatterns: [
		'<rootDir>/node_modules/(?!(igu/core/basic|igu|igu/core/utils))',
	],
	moduleFileExtensions: [
		'vue',
		'js',
		'json',
		'jsx',
		'ts',
		'tsx',
		'node',
		'scss',
	],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	verbose: true,
	moduleDirectories: ['node_modules', 'project/src'],
	modulePaths: ['<rootDir>/project/src'],
	// 测试文件
	testMatch: ['<rootDir>/project/__test__/**/*.(spec|test).(ts|js)?(x)'],
	moduleNameMapper: {
		'\\.(css | scss)$': 'identity-obj-proxy',
		'^_common/(.*)$': '<rootDir>/common/$1',
		'^@/(.*)$': '<rootDir>/project/src/$1',
		'^@api/(.*)$': ['<rootDir>/project/src/api/$1'],
		'^@scss/(.*)$': '<rootDir>/project/src/scss/$1',
		'^@view/(.*)$': '<rootDir>/project/src/view/$1',
		'^@images/(.*)$': '<rootDir>/project/src/images/$1',
		'^@config/(.*)$': '<rootDir>/project/src/config/$1',
		'^@shared/(.*)$': '<rootDir>/project/src/shared/$1',
		'^@store/(.*)$': '<rootDir>/project/src/config/store/$1',
		'^@router/(.*)$': '<rootDir>/project/src/config/router/$1',
		'^@containers/(.*)$': '<rootDir>/project/src/containers/$1',
		'^@components/(.*)$': '<rootDir>/project/src/components/$1',
	},
	transform: {
		'^.+\\.vue$': 'vue-jest',
		'^.+\\js$': 'babel-jest',
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			tsconfig: {
				target: 'esnext',
			},
		},
	},
};
