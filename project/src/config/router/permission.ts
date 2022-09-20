/*
 * @Autor        : Pat
 * @Description  : Router intercept processing
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-02-30 10:40:45
 * @LastEditors  : Pat
 * @LastEditTime : 2022-05-09 18:45:42
 */
import { outputStore } from '@store';
import { AnyObject } from 'igu/lib/core/utils';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
/**
 * @description: set router
 * @param {AnyObject} param router object
 * @Date: 2021-03-30 11:02:42
 * @author: Pat
 */
export default function ({ beforeEach }: AnyObject) {
	// This's vue router beforeEcah routers
	beforeEach(
		(
			to: RouteLocationNormalized,
			_path: RouteLocationNormalized,
			next: NavigationGuardNext,
		) => {
			const pageName = outputStore('config.config.systemName');
			const {
				meta: { name: _toMetaTitle },
				name: _toName,
			} = to;
			// Used as a login page, the browser cannot move forward or backward
			// Exist current to router name
			// Document title is current to router name
			document.title = `${pageName ? `${pageName} - ` : ''}${
				_toMetaTitle || _toName
			}`;
			next();
		},
	);

	// onError(() => {});
}
