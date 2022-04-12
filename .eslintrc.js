/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2022-04-12 08:50:57
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-12 15:51:49
 */
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
	root: true,
	/* 指定如何解析语法。*/
	parser: 'vue-eslint-parser',
	/* 优先级低于parse的语法解析配置 */
	parserOptions: {
		parser: '@typescript-eslint/parser',
		//模块化方案
		sourceType: 'module',
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
		// 解决 defineProps and defineEmits generate no-undef warnings
		'vue/setup-compiler-macros': true,
	},
	// https://eslint.bootcss.com/docs/user-guide/configuring#specifying-globals
	globals: {},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended', // typescript-eslint推荐规则,
		'prettier',
		'plugin:prettier/recommended',
	],
	// https://cn.eslint.org/docs/rules/
	rules: {
		semi: ['error', 'always'],
		// 优先使用 interface 而不是 type
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/no-explicit-any': 'off', // 可以使用 any 类型
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		// 解决使用 require() Require statement not part of import statement. 的问题
		'@typescript-eslint/no-var-requires': 0,
		// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/ban-types.md
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					// add a custom message to help explain why not to use it
					Foo: "Don't use Foo because it is unsafe",

					// add a custom message, AND tell the plugin how to fix it
					String: {
						message: 'Use string instead',
						fixWith: 'string',
					},

					'{}': {
						message: 'Use object instead',
						fixWith: 'object',
					},
				},
			},
		],
		// 禁止出现未使用的变量
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ vars: 'all', args: 'after-used', ignoreRestSiblings: false },
		],
		'vue/html-indent': 'off',
		// 关闭此规则 使用 prettier 的格式化规则，
		'vue/max-attributes-per-line': ['off'],
		// 强制使用驼峰
		camelcase: ['error', { properties: 'always' }],
		'no-undef': 2,
		'comma-dangle': [2, 'always-multiline'],
		'no-var': 'error',
		'no-console': [2, { allow: ['warn', 'error'] }],
		'object-shorthand': 2,
		'no-unused-vars': [2, { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
		'vue/multi-word-component-names': 'off',
		'vue/no-v-html': 'off',
		'vue/require-explicit-emits': 'off',
		'vue/require-prop-types': 'off',
		'vue/require-default-prop': 'off',
		'vue/no-reserved-keys': 'off',
		'vue/comment-directive': 'off',
		'vue/order-in-components': 'off',
		'vue/prop-name-casing': 'off',
		'vue/one-component-per-file': 'off',
		'vue/custom-event-name-casing': 'off',
		'vue/v-on-event-hyphenation': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'vue/no-setup-props-destructure': 'off',
		'no-async-promise-executor': 'off',
		// 优先使用 const
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: false,
			},
		],
	},
});
