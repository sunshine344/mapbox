/*
 * @Autor        : Pat
 * @Description  : config
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-29 12:39:06
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 14:28:18
 */
import { AnyObject } from "igu/core/utils";
import { output, eachModules, isType } from "@shared/_utlis";

export { RequestObject } from "@config/type/global";
let configObject: AnyObject = {};
// Output the specified file in the specified folder
eachModules(import.meta.globEager('./core/*'), (key: any, item: AnyObject) => {
    let fileName: string = key.replaceAll('./core', '').split("/")[1].replace(/\.(ts|js)/, "");
    configObject[fileName] = {};
    if (item.default) configObject[fileName] = item.default;
    if (item && typeof item == 'object') Object.keys(item).forEach((name: string) => (configObject[fileName][name] = item[name]));
});

export default function (configKey: any, option: Array<string> | string = "") {
    let url: string = "";
    if (configKey) {
        if (isType(configKey, "Array")) {
            configKey.map((item: string, index: number) => (url += index == 0 ? item : `.${item}`))
        } else {
            url = configKey
        }
    }
    return output(url, option, configObject);
};

