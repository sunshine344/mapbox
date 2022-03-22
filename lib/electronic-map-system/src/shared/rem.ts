/*
 * @Autor        : Pat
 * @Description  : request rem
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-20 15:55:36
 */
export default function requestRem(defineWidth: number = 1920) {
    (function (win, doc, dWidth) {
        if (!win.addEventListener) return;
        const html = document.documentElement;
        function setFont() {
            const cliWidth = html.clientWidth;
            html.style.fontSize = 12 * (cliWidth / dWidth) + 'px';
        }
        win.addEventListener('resize', setFont, false)
        doc.addEventListener('DOMContentLoaded', setFont, false)
    })(window, document, defineWidth)
};