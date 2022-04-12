/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:02
 * @LastEditors  : Pat
 * @LastEditTime : 2022-01-27 14:30:19
 */
module.exports = {
	plugins: {
		'postcss-pxtorem': {
			// 设计稿元素尺寸/rootValue
			rootValue: 14,
			propList: ['*'],
			unitPrecision: 6,
			minPixelValue: 2,
		},
	},
};
