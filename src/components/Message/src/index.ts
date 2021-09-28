/*
 * @Autor        : Pat
 * @Description  : Refactored ElDropdown
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-19 10:41:24
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-27 18:20:58
 */
import { App, createVNode, render as render$1, isVNode, nextTick } from 'vue';
import MessageComponent from "./core/MessageComponent";
declare interface AnyObject {
    [key: string]: any;
}
let seed = 1, vm, time = 0, currentTime = 0;
const instances: any = [];
/**
 * @description: 创建Message实例对象
 * @param {AnyObject} opts 参数条件
 * @Date: 2021-02-05 11:28:06
 * @author: Pat
 */
const Message: any = function (opts: AnyObject | string = {}) {
    if (typeof opts === 'string') {
        opts = {
            message: opts,
            type: "info"
        };
    }
    opts.duration = opts.duration == false ? 0 : opts.duration ? opts.duration : 2000
    let options = opts, ctime = new Date().getTime(),
        mainLen = document.querySelectorAll(".el-msg-container").length;
    let verticalOffset = opts.offset || 20;
    opts.position = opts.position || "bottom";
    opts.animation = opts.animation || "right";
    const id = 'message_' + seed++,
        callback: Function = options.onClose,
        container = document.createElement('div'),
        message = options.message;
    if (opts.animation === opts.position) {
        if (opts.animation == "right" || opts.animation == "left") {
            opts.position = "bottom"
        } else {
            opts.animation = "right";
        }
    }
    if (ctime - currentTime > 1000 && mainLen <= 0) {
        time = opts.duration;
    } else {
        time = ((mainLen + 1) * 1100) + opts.duration
    };
    currentTime = ctime;
    opts.time = time;
    instances.forEach(({ vm }: AnyObject) => {
        verticalOffset += (vm && vm.el && vm.el.offsetHeight || 0) + 16;
    });
    verticalOffset += 16;
    options = Object.assign(Object.assign({}, options), { onClose: () => { close(id, callback) }, offset: verticalOffset, id });
    container.className = `container_${id} el-msg-container`;
    vm = createVNode(MessageComponent, options, isVNode(options.message) ? { default: () => message } : null);
    render$1(vm, container);
    instances.push({ vm, $el: container });
    document.body.appendChild(container);
    return { close: options.onClose };
};
/**
 * @description: Message消息框关闭事件
 * @param {string} id Message消息框ID
 * @param {Function} callback 关闭事件回调函数
 * @Date: 2021-02-05 11:26:31
 * @author: Pat
 */
function close(id: string = "", callback: Function | null = null) {
    const idx = instances.findIndex(({ vm }: any) => {
        const { id: _id } = vm.component.props;
        return id === _id;
    });
    if (idx === -1) {
        return;
    }
    const { vm, $el } = instances[idx];
    if (!vm) {
        return;
    }
    callback === null || callback === void 0 ? void 0 : callback(vm);
    const removedHeight = vm.el.offsetHeight;
    vm.el.classList.add("msg-out");
    setTimeout(() => {
        render$1(null, $el);
        nextTick(() => document.body.removeChild($el));
    }, 700);
    instances.splice(idx, 1);
    const len = instances.length;
    if (len < 1) {
        return;
    }
    for (let i = idx; i < len; i++) {
        let props: AnyObject = instances[i].vm.component.props;
        const pos = parseInt(instances[i].vm.el.style[props.position], 10) - removedHeight - 16;
        props.offset = pos;
        props.vertOffset = pos;
    }
};
// 定义Message类型
['success', 'warning', 'info', 'error'].forEach((type: string = "success") => {
    Message[type] = (options: AnyObject) => {
        if (typeof options === 'string') {
            options = { message: options, type };
        } else {
            options.type = type;
        }
        return Message(options);
    };
});
// Initialization current components
// Retrieve the registered component (always return the constructor)
// https://v3.cn.vuejs.org/api/application-api.html#component
Message.install = (app: App<Element>) => app.component(Message.name, Message);
export default Message;
