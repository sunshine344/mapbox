// vue
type AnyObject =  {[key:string] :any};
declare module '*.vue' {
	import type { App, defineComponent } from 'vue';
	const component: ReturnType<typeof defineComponent> & {
		install(app: App): void;
	};
	export default component;
}

declare module '@components/Message' {
	const component: any;
	export default component;
}
