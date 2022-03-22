/*
 * @Author: your name
 * @Date: 2022-01-20 17:09:43
 * @LastEditTime: 2022-01-21 10:49:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \code\src\assets\config.js
 */
import img from '@/assets/images/crash.png';

declare interface AnyObject { //声明数组对象
    [key: string]: any;
}
console.log(typeof img);

let colorConfig: AnyObject = {
    '--fontColorfff': '#5F6477',
    '--subareaBackground': 'transparent',
    '--userBackground': 'transparent',
    '--toolBackground': 'transparent',
    '--menuNormal': 'transparent',
    '--menuChecked': 'transparent',
    '--menuHover': 'transparent',
    '--mapToolBackground': 'transparent',
    '--toolBarBackground': 'transparent',
}

export default colorConfig;
