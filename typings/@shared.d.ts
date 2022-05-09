

declare module '@shared/storage' {
	export function Case(str: string): string;
	export function setup(name: any, params: any, expires?: string | number): any;
	export function getsub(name: string): any;
	export function removeSub(...name: any): any;
	export function clearAll(): any;
	export function clear(): any;
	export default Storage;
}

declare module '@shared/_utlis' {
	export function eachModules(
		folderObject: AnyObject | any,
		callback: (key: string, data: any) => void,
	): any;
	export const isType : (obj: any, type: string)=> boolean;
	export const stringCase : (str: string)=> string;
	export function rmArr(array: Array<any>, key: any): Array<any>
	export function output(
		configKey: string | null,
		option?: Array<string> | string,
		defaultObject?: AnyObject,
	): any;

}

declare module '@shared/rem' {
	export default function requestRem(defineWidth?: number): void;
}
