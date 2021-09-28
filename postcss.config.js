/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:02
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 11:34:50
 */
module.exports = {
    plugins: {
        'postcss-pxtorem': {
            // 设计稿元素尺寸/rootValue
            rootValue: 2,
            propList: ['*']
        }
    }
}