/*
 * @Autor        : Pat
 * @Description  : basicDirInfos Mock
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-26 11:26:30
 * @LastEditors  : Pat
 * @LastEditTime : 2021-04-06 17:03:25
 */
import Mock, { setupMock, createDataType, stringCase } from "../_utlis";
let Random = Mock.Random;
export default setupMock('/login/submit', 'post', ({ method }: any) => {
    if (stringCase(method) == stringCase("post")) {
        return createDataType({
            "role|1": ["[ROLE_admin, ROLE_temp]", "[ROLE_admin]", "[ROLE_temp]"],
            "name": Random.cname(),
            "id": Random.id(),
            "token": `yportal ${Random.string('lower', 25)}`
        })
    }
    return "Not's method post";
}, "用户登录接口");
