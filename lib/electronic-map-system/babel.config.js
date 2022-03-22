/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-27 10:05:47
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 14:27:13
 */
module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
    ],
    plugins: ["transform-es2015-modules-commonjs"],
    env: {
        test: {
            plugins: ["@babel/plugin-transform-runtime"]
        }
    }
};