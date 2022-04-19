/*
 * @Autor        : Pat
 * @Description  :
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2021-09-17 15:08:43
 * @LastEditors  : Pat
 * @LastEditTime : 2022-04-19 10:05:23
 */
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { ambiences } from 'ambiences';
import legacy from '@vitejs/plugin-legacy';
import { createProxy, wrapperEnv } from './config/common';
import { defineConfig, ConfigEnv, loadEnv, PluginOption } from 'vite';
export const pathResolve = (dir: string) => resolve(__dirname, '.', dir);
// console.log(ambience)
// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): any => {
	const root = process.cwd();
	const env = loadEnv(mode, root);
	const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_LEGACY } = wrapperEnv(env);
	const outDir = `dist/egis-manage-web`;
	// createJenkinsConfig(mode);
	return defineConfig({
		root,
		resolve: {
			alias: {
				'@/': `${pathResolve('src')}/`,
				'@view': `${pathResolve('src/view')}/`,
				'@components': `${pathResolve('src/components')}/`,
				'@config': `${pathResolve('src/config')}/`,
				'@enum': `${pathResolve('src/config')}/enum.ts`,
				'@containers': `${pathResolve('src/containers')}/`,
				'@api': `${pathResolve('src/api')}/`,
				'@images': `${pathResolve('src/assets/images')}/`,
				'@scss': `${pathResolve('src/assets/scss')}/`,
				'@router': `${pathResolve('src/config/router')}/`,
				'@store': `${pathResolve('src/config/store')}/`,
				'@shared': `${pathResolve('src/shared')}/`,
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		plugins: [
			vue(),
			legacy({
				targets: ['> 1%, last 1 version, ie >= 8'],
				// 面向IE11时需要此插件
				additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
			}),
			ambiences('json', outDir, {
				// 开发环境需要什么amb.*类型文件，可选 ts、tsx、js、jsx
				env: 'ts',
				// 开发环境中配置文件输出到什么目录
				path: 'src/config',
			}) as unknown as PluginOption,
		],
		define: {
			__VUE_I18N_LEGACY_API__: false,
			__VUE_I18N_FULL_INSTALL__: false,
			__INTLIFY_PROD_DEVTOOLS__: false,
		},
		// Basic public path when serving in production
		base: mode.indexOf('pro') > -1 ? '/' : VITE_PUBLIC_PATH,
		// lintOnSave: true,
		build: {
			// The directory related to "root" where the build output will be placed.
			// If the directory exists, it will be deleted before building.
			// The default is "dist"
			// outDir: OUT_DIR_NAME,
			outDir,
			polyfillDynamicImport: VITE_LEGACY,
			// terserOptions: {
			//     compress: {
			//         keep_infinity: true,
			//         drop_console: true,
			//         drop_debugger: true,
			//     },
			// },
			// minify: 'terser',
			rollupOptions: {
				output: {
					// compact: true,
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().split('node_modules/')[1].split('/')[0].toString();
						}
					},
				},
			},
			// 设置资源路径
			// assetsDir: OUT_DIR_NAME,
			assetsInlineLimit: 10000,
			cssCodeSplit: true,
			cssTarget: 'chrome61',
			// 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
			brotliSize: false,
			manifest: true,
			// chunk 大小警告的限制（以 kbs 为单位）
			chunkSizeWarningLimit: 1000,
			commonjsOptions: { ignore: [] },
		},
		css: {
			preprocessorOptions: {
				scss: {
					charset: false,
				},
			},
		},
		// Api reverse proxy
		server: {
			cors: true,
			port: VITE_PORT,
			proxy: createProxy(VITE_PROXY),
			hmr: { overlay: false },
		},
	});
};
