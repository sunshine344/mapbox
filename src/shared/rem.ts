/*
 * @Autor        : Pat
 * @Description  : request rem
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:57
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-18 15:10:03
 */
export default function requestRem(defineWidth: number = 1920) {
    (function (win, doc, dWidth) {
        if (!win.addEventListener) return;
        const html = document.documentElement;
        function setFont() {
            const cliWidth = html.clientWidth;
            html.style.fontSize = 14 * (cliWidth / dWidth) + 'px';
        }
        win.addEventListener('resize', setFont, false)
        doc.addEventListener('DOMContentLoaded', setFont, false)
    })(window, document, defineWidth)
};