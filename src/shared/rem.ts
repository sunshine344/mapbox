/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 16:01:57
 * @LastEditors  : Pat
 * @LastEditTime : 2022-01-27 15:39:33
 */

export default function requestRem(defineWidth: number = 1920) {
    (function (win, doc, dWidth) {
        if (!win.addEventListener) return;
        const html: HTMLElement = document.documentElement;
        const defineWidths = defineWidth / 1.5;
        function setFont() {
            const cliWidth: number = html.clientWidth;
            let fontSize: string = 14 * (cliWidth / dWidth) + 'px'
            html.style.width = "";
            if (cliWidth <= defineWidths) {
                html.style.width = defineWidths + "px";
                fontSize = '14px';
            }
            html.style.fontSize = fontSize;
        }
        win.addEventListener('resize', setFont, false)
        doc.addEventListener('DOMContentLoaded', setFont, false)
    })(window, document, defineWidth)
}