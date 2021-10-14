/*
 * @Autor        : Pat
 * @Description  : .ambience
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-29 10:52:54
 * @LastEditors  : Pat
 * @LastEditTime : 2021-10-14 17:19:28
 */
const fs = require("fs");
const resolve = (dir = '/') => dir;
const TARGET = process.env.npm_lifecycle_event;
const SCRIPT = process.env.npm_lifecycle_script;
const stringify = JSON.stringify;
function ambiences(type = "js", outDir) {
    // console.log(TARGET)
    const igs = (Array.isArray(SCRIPT) && SCRIPT.length > 0 ? SCRIPT[0] : SCRIPT).split(/[\r\n| ]/);
    const ENV = igs.filter((item) => item.includes('NODE_ENV'));
    const envStr = ENV.length > 0 && ENV[ENV.length - 1].split(/=/)[1];
    const data = fs.readFileSync('.ambiences', 'utf-8');
    const curentCon = data.split('[[').filter(item => item.includes(envStr));
    const c = curentCon.length > 0 ? curentCon[0] : "";
    const config = {};
    console.log(igs);
    if (!c)
        return;
    const [cName, cConfig] = c.split(/]]/);
    let [exportStr, expName, ambienceJSON] = [`\r\nexport const ENV = "${envStr}";`, ``, `{`];
    const ccon = cConfig.split(/[[]/).filter(item => item !== "\r\n" && !item === false);
    ccon.forEach(item => {
        if (item.includes("]\r\n")) {
            let currentObj = `{\r\n`;
            let currentStr = currentObj;
            const [fileName, conetnt] = item.split(/]\r\n/);
            if (conetnt) {
                conetnt.split(/\r\n/).forEach(conetntItem => {
                    if (conetntItem) {
                        if (conetntItem.includes("=")) {
                            const [key, value] = conetntItem.split(/=/);
                            const valueStr = value.includes("{") || value.includes("[") ? value : value.replace(/;|,|。/g, '');
                            const str = `     "${key.replace(/\s*/g, "")}":${valueStr},\r\n`;
                            currentObj += `     ${str}`;
                            currentStr += str;
                        }
                        else {
                            currentStr += `     ${conetntItem},\r\n`;
                        }
                    }
                });
            }
            expName += `${fileName},`;
            currentStr = `${currentStr.replace(/,$/, "")}}`;
            ambienceJSON += `\r\n     "${fileName}":${currentObj.replace(/,\r\n$/, "\r\n")}     },`;
            // exportStr += `\r\nexport const ${fileName} = ${stringify(currentObj)};`;
            exportStr += `\r\nexport const ${fileName} = ${currentStr};`;
            config[fileName] = currentStr;
        }
    });
    ambienceJSON = `${ambienceJSON.replace(/,$/, "")}\r\n}`;
    const conetnt = `
        ${exportStr}
        \r\nexport default {${expName.replace(/,$/, "")}}
    `;
    const createFile = (path = `src/ambiences.config.js`, c = conetnt) => {
        fs.writeFile(resolve(path), c, (err) => {
            if (err)
                return console.log(err);
            // console.log("The file was saved!");
        });
    };
    // const ambData = fs.readdirSync(resolve(`src`));
    fs.readdir(resolve(`src`), (err) => {
        if (err) {
            fs.mkdir(resolve(`src`), (err) => !err && createFile());
        }
        else {
            createFile('src/amb.js', conetnt);
        }
        ;
    });
    if (outDir && (envStr === 'production' || (TARGET && TARGET.includes('build')))) {
        const createAmb = () => setTimeout(() => createFile(`${outDir}/ambiences.config.${type}`, ambienceJSON), 100);
        if (type === "js")
            ambienceJSON = `var ambiences = ${ambienceJSON}`;
        if (outDir) {
            fs.readdir(resolve(outDir), (err) => {
                if (err) {
                    fs.mkdir(resolve(outDir), (err) => !err && createAmb());
                }
                else {
                    createAmb();
                }
                ;
            });
        }
        ;
    }
}
;
exports.default = exports.ambiences = ambiences;