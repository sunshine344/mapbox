/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-01-20 09:20:23
 * @LastEditors  : Pat
 * @LastEditTime : 2021-09-18 15:25:49
 */
import "./error.scss";
import { RouterLink } from 'vue-router';
import { createBlock, createTextVNode, createVNode, defineComponent, Fragment, onBeforeUpdate, onMounted, openBlock, renderList, toDisplayString, withCtx } from 'vue';

function randomNum(): any {
	return Math.floor(Math.random() * 9) + 1;
};

function initMath(math: Array<string | null>): any {
	let time = 20, i = 0, timr: Array<number | any> = [];
	math.forEach((element: string | null, index: number) => {
		const currentElement: any = document.querySelector(`.Digit_${index}`);
		element;
		timr.push(setInterval(() => {
			if (i > (40 * (index + 0.6))) {
				clearInterval(timr[index]);
				currentElement.textContent = math[index];
			} else {
				currentElement.textContent = randomNum();
				i++;
			};
		}, time));
	});
	return timr;
};

export default defineComponent({
	setup() {
		let timr: Array<number | any> = [], math: Array<string | null> = ["4", "0", "4"], msg: String = "访问的页面不存在！";
		let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		onMounted(() => {
			timr = initMath(math);
		});

		onBeforeUpdate(() => {
			timr.forEach(item => clearInterval(item));
		});

		return () => (openBlock(), createBlock("div", { class: "error" }, [
			createVNode("div", { class: "container-floud" }, [
				createVNode("div", { class: "ground-color" }, [
					createVNode("div", { class: "container-error-404" }, [
						(openBlock(true), createBlock(Fragment, null, renderList(math, (item, index) => {
							return (openBlock(), createBlock("div", {
								class: "clip",
								key: index
							}, [
								createVNode("div", { class: "shadow" }, [
									createVNode("span", {
										class: `digit Digit_${index}`
									}, toDisplayString(item), 3 /* TEXT, CLASS */)
								])
							]))
						}), 128 /* KEYED_FRAGMENT */)),
						createVNode("div", { class: "msg" }, [
							createTextVNode(" OH! "),
							createVNode("span", { class: "triangle" })
						]),
					]),
					createVNode("h2", { class: "h1" }, msg),
					createVNode("p", null, [
						createVNode(RouterLink, {
							class: "tohome",
							to: "/home"
						}, { default: withCtx(() => [createTextVNode('返回首页')]) })
					])
				])
			]),
			(openBlock(true), createBlock("ul", null, renderList(list, () => (openBlock(), createBlock("li"))), 128 /* KEYED_FRAGMENT */)),
		]))
	}
})