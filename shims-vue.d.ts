/*
 * @Autor        : Pat
 * @Description  : shims-vue.d.ts
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-14 16:01:41
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-24 16:07:15
 */

// declare module ambfs type
declare module 'p.fs.amb' {
    const ambfs: Function;
    export default ambfs;
}