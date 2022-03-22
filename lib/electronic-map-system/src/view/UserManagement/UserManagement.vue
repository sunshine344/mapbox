<template>
  <div class="UserManagementBox">
    <div class="leftNav">
      <leftNav></leftNav>
    </div>
    <div class="rightCon">
      <div class="topSerch">
        <div class="le">
          <a-input v-model:value="queryValue" placeholder="请输入关键字">
          </a-input>
          <a-button @click="serch">搜索</a-button>
        </div>

        <div class="ri">
          <a-button @click="addMoudl">新增</a-button>
        </div>
      </div>

      <div class="tab">
        <table class="bomtab">
          <thead>
            <tr>
              <th>序号</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>部门</th>
              <th>角色</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in data.tabList" :key="i">
              <td>{{ Number(i) + 1 }}</td>
              <td>{{ item.account }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.departmentName }}</td>
              <td>{{ item.bjRole.description }}</td>
              <td>{{ item.createTime }}</td>
              <td>
                <a-button @click="edit(item)">编辑</a-button>

                <a-button @click="del(item.userId)">删除</a-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pag">
        <a-pagination
          v-model:current="current"
          size="small"
          :pageSize="10"
          :total="Number(data.total)"
        />
      </div>

      <!-- 新增弹框 -->
      <div v-show="data.showModul" class="modal">
        <div class="modulbox">
          <div class="modulHead">
            <div class="modulHeadLeft">
              <span></span>
              新 增
            </div>
            <img @click="resFom()" src="./src/images/guanbi.png" alt="" />
          </div>
          <div class="from">
            <a-form
              hideRequiredMark
              layout="inline"
              name="edit"
              :model="formInline"
              @finish="onFinish"
            >
              <a-form-item
                name="name"
                :rules="[{ required: true, message: '请正确填写姓名' }]"
              >
                <p>姓名</p>
                <a-input
                  v-model:value="formInline.name"
                  placeholder="请输入姓名"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="account"
                :rules="[{ required: true, message: '请正确填写用户名' }]"
              >
                <p>用户名</p>
                <a-input
                  v-model:value="formInline.account"
                  placeholder="请输入用户名"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="password"
                :rules="[{ required: true, message: '请正确填写密码' }]"
              >
                <p>密码</p>
                <a-input-password
                  v-model:value="formInline.password"
                  placeholder="请输入密码"
                >
                </a-input-password>
              </a-form-item>
              <a-form-item
                name="mobile"
                type="number"
                :rules="[
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    required: true,
                    message: '请正确填写11位手机号码',
                  },
                ]"
              >
                <p>手机号码</p>
                <a-input
                  v-model:value="formInline.mobile"
                  placeholder="请输入手机号码"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="departmentName"
                :rules="[{ required: true, message: '请正确填写部门' }]"
              >
                <p>部门</p>
                <a-input
                  v-model:value="formInline.departmentName"
                  placeholder="请输入部门"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="roleId"
                :rules="[{ required: true, message: '请正确选择角色' }]"
              >
                <p>角色</p>
                <a-select
                  v-model:value="formInline.roleId"
                  placeholder="请选择角色身份"
                >
                  <a-select-option
                    v-for="(item, i) in data.roleList"
                    :key="i"
                    :value="item.id"
                    >{{ item.description }}</a-select-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="resFom">取消</a-button>
                <a-button style="margin-left: 20px" html-type="submit"
                  >确定</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <!-- 编辑弹框 -->
      <div v-show="data.editModul" class="modal">
        <div class="modulbox">
          <div class="modulHead">
            <div class="modulHeadLeft">
              <span></span>
              编 辑
            </div>
            <img
              @click="data.editModul = false"
              src="./src/images/guanbi.png"
            />
          </div>
          <div class="from">
            <a-form
              hideRequiredMark
              layout="inline"
              name="basic"
              :model="updatInline"
              @finish="editFinish"
            >
              <a-form-item
                name="name"
                :rules="[{ required: true, message: '请正确填写姓名' }]"
              >
                <p>姓名</p>
                <a-input
                  v-model:value="updatInline.name"
                  placeholder="请输入姓名"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="account"
                :rules="[{ required: true, message: '请正确填写用户名' }]"
              >
                <p>用户名</p>
                <a-input
                  v-model:value="updatInline.account"
                  placeholder="请输入用户名"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="password"
                :rules="[{ required: true, message: '请正确填写密码' }]"
              >
                <p>密码</p>
                <a-input-password
                  v-model:value="updatInline.password"
                  placeholder="请输入密码"
                >
                </a-input-password>
              </a-form-item>
              <a-form-item
                name="mobile"
                type="number"
                :rules="[
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    required: true,
                    message: '请正确填写11位手机号码',
                  },
                ]"
              >
                <p>手机号码</p>
                <a-input
                  v-model:value="updatInline.mobile"
                  placeholder="请输入手机号码"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="departmentName"
                :rules="[{ required: true, message: '请正确填写部门' }]"
              >
                <p>部门</p>
                <a-input
                  v-model:value="updatInline.departmentName"
                  placeholder="请输入部门"
                >
                </a-input>
              </a-form-item>
              <a-form-item
                name="roleId"
                :rules="[{ required: true, message: '请正确选择角色' }]"
              >
                <p>角色</p>
                <a-select
                  v-model:value="updatInline.roleId"
                  placeholder="请选择角色身份"
                >
                  <a-select-option
                    v-for="(item, i) in data.roleList"
                    :key="i"
                    :value="item.id"
                    >{{ item.description }}</a-select-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="data.editModul = false">取消</a-button>
                <a-button style="margin-left: 20px" html-type="submit"
                  >保存</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "./UserManagement.scss";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  onMounted,
  watch,
  createVNode,
} from "vue";
import {
  GetAllUser,
  AddUser,
  getRole,
  DeleteUser,
  updateUser,
} from "@api/core/use.ts";
// 搜索数据
interface userInfo {
  queryValue: string;
  nowPage: number;
  pageSize: number;
}
// 编辑数据
interface updatUser {
  name: string;
  password: string;
  account: string;
  mobile: string;
  roleId: null;
  departmentName: string;
  userId: null;
}
// 删除数据
interface delUser {
  userId: string;
}
//新增数据
interface FormState {
  name: string;
  password: string;
  account: string;
  mobile: string;
  roleId: null;
  departmentName: string;
}
export default defineComponent({
  components: {
    leftNav: defineAsyncComponent(
      () => import("@/components/LeftNav/LeftNav.vue")
    ),
  },
  setup() {
    const updatInline = reactive<updatUser>({
      name: "",
      password: "",
      account: "",
      mobile: "",
      roleId: null,
      departmentName: "",
      userId: null,
    });
    const formInline = reactive<FormState>({
      name: "",
      password: "",
      account: "",
      mobile: "",
      roleId: null,
      departmentName: "",
    });
    // 搜索数据
    const userInfo = reactive<userInfo>({
      queryValue: "",
      nowPage: 1,
      pageSize: 10,
    });

    // 删除用户id
    const delUser = reactive<delUser>({
      userId: "",
    });
    // 头部搜索数据
    const queryValue = ref<string>("");

    const data: any = reactive({
      // 表格数据
      tabList: [],
      // 角色选择数据
      roleList: [],
      // 新增弹框显示
      showModul: false,
      // 编辑弹框显示
      editModul: false,
      total: 10,
    });

    // 头部搜索
    function serch() {
      userInfo.queryValue = queryValue.value;
      getData();
    }

    // 获取表格数据方法
    function getData() {
      GetAllUser(userInfo).then((res: AnyObject) => {
        if (res.code == 0) {
          data.tabList = res.data.data;
          data.total = res.data.total;
        }
      });
    }
    onMounted(() => {
      getData();
    });

    // 新增弹框保存
    const onFinish = (values: any) => {
      AddUser(formInline).then((res: AnyObject) => {
        if (res.code == 0) {
          message.success("新增成功");
          getData();
          resFom();
        }
      });
    };
    // 打开编辑弹框
    function edit(obj: any) {
      // updatInline = obj;
      data.editModul = true;
      getRole().then((res: AnyObject) => {
        if (res.code == 0) {
          data.roleList = res.data;
        }
      });
      updatInline.name = obj.name;
      updatInline.password = obj.password;
      updatInline.account = obj.account;
      updatInline.mobile = obj.mobile;
      updatInline.roleId = obj.bjRole.id;
      updatInline.departmentName = obj.departmentName;
      updatInline.userId = obj.userId;
    }

    // 打开新增弹框
    function addMoudl() {
      getRole().then((res: AnyObject) => {
        if (res.code == 0) {
          data.roleList = res.data;
        }
        data.showModul = true;
      });
    }
    // 编辑弹框保存
    function editFinish(values: any) {
      updateUser(updatInline).then((res: AnyObject) => {
        if (res.code == 0) {
          message.success("修改成功");
          getData();
          data.editModul = false;
        }
      });
    }

    // 删除用户
    function del(val: string) {
      Modal.confirm({
        title: "此操作将永久删除，是否继续?",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确认",
        cancelText: "取消",
        onOk() {
          delUser.userId = val;
          DeleteUser(delUser).then((res: AnyObject) => {
            if (res.code == 0) {
              getData();
              message.success("删除成功");
            }
          });
        },
        onCancel() {},
      });
    }
    // 关闭弹框
    function resFom() {
      formInline.name = "";
      formInline.password = "";
      formInline.account = "";
      formInline.mobile = "";
      formInline.roleId = null;
      formInline.departmentName = "";
      data.showModul = false;
    }
    // 当前页数
    const current = ref(1);
    watch(current, () => {
      userInfo.nowPage = current.value;
      getData();
    });
    return {
      updatInline,
      editFinish,
      edit,
      current,
      resFom,
      del,
      delUser,
      formInline,
      addMoudl,
      getData,
      data,
      serch,
      queryValue,
      onFinish,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>