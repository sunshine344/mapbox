declare module '@store' {
	import { App } from 'vue';
	interface IStore {
		state?: AnyObject;
		actions: AnyObject;
		modules?: AnyObject;
		[key: string]: any;
	}
	const store: <AnyObject>(optons: IStore) => IStore;
	export const actions: AnyObject;
	export const state: AnyObject;
	export const clearState: (name?: string) => void;
	export const setupStore: (app: App<Element>) => any;
	export const outputStore: (key: string, key0?: string | string[]) => any;
	// Throw current store
	export default store;
}
