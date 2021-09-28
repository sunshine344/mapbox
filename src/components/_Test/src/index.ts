/*
 * @Autor        : Pat
 * @Description  : Timeline
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-03-03 16:32:01
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-28 14:48:29
 */
import { AnyObject } from 'igu/core/utils';
import { defineComponent, App } from 'vue';

const props = {
}

// Initialization module
const TimelineComponent = defineComponent({
    name: '_Test',
    props,
    // Initialization
    // Vue3.0 nitialization function
    // https://v3.cn.vuejs.org/guide/migration/attrs-includes-class-style.html#%E6%A6%82%E8%A7%88
    setup() {
        return {}
    }
});

/**
 * @description: Initialization render function
 *               Node information required for rendering components
 *               https://v3.cn.vuejs.org/guide/migration/render-function-api.html#_3-x-%E8%AF%AD%E6%B3%95-2
 * @param {any} _ctx Vue prototype function object
 * @Date: 2021-01-28 14:26:18
 * @author: Pat
 */
TimelineComponent.render = (_ctx: AnyObject) => {
    return
};
// Initialization current components
// Retrieve the registered component (always return the constructor)
// https://v3.cn.vuejs.org/api/application-api.html#component
TimelineComponent.install = (app: App<Element>) => app.component(TimelineComponent.name, TimelineComponent);
export default TimelineComponent;
