/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:02
 * @LastEditors  : Pat
 * @LastEditTime : 2022-02-25 17:54:23
 */
module.exports = {
    from: undefined,
    plugins: {
        'postcss-pxtorem': {
            // 设计稿元素尺寸/rootValue
            rootValue: 12,
            propList: ['*'],
            unitPrecision: 5,
            minPixelvalue: 12
        }
    }
}