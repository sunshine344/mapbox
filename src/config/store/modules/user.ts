/*
 * @Autor        : Pat
 * @Description  : User Store
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-02-19 16:24:08
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-17 16:11:55
 */
const state = {
    user: {},
    collapseState: false
}

const mutations = {
    SET_USERINFO: (state: any, user: any) => {
        state.user = user;
    },
    SET_COLLAPSE: (state: any, collapseState: boolean) => {
        state.collapseState = collapseState;
    }
}

const actions = {
    generateUser({ commit }: any, info: any) {
        return new Promise(resolve => {
            commit('SET_USERINFO', info)
            resolve(info)
        })
    },
    generateCollapseState({ commit }: any, state: boolean) {
        return new Promise(resolve => {
            commit('SET_COLLAPSE', state)
            resolve(state)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
