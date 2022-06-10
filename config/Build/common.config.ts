/* eslint-disable camelcase */
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { ambiences } from '@elgis/ambiences';
// import legacy from '@vitejs/plugin-legacy';
import { PluginOption, UserConfigExport, BuildOptions } from 'vite';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';
export const pathResolve = (dir: string) => resolve(__dirname, '../../', dir);
export const setPlugins = (
	inputDir: string,
	outDir: string,
	path = 'src/config',
) => [
	vue(),
	// legacy({
	//     targets: ['> 1%, last 1 version, ie >= 8'],
	//     // 面向IE11时需要此插件
	//     additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
	// }),
	ViteComponents({
		globalComponentsDeclaration: true,
		customComponentResolvers: [AntDesignVueResolver()],
	}),
	ambiences('json', `${inputDir}/${outDir}`, {
		inputDir,
		// 开发环境需要什么amb.*类型文件，可选 ts、tsx、js、jsx
		env: 'ts',
		// 开发环境中配置文件输出到什么目录
		path: `${inputDir}/${path}`,
	}) as unknown as PluginOption,
];

export const build: BuildOptions = {
	// 设置资源路径
	// assetsDir: OUT_DIR_NAME,
	assetsInlineLimit: 10000,
	cssCodeSplit: true,
	cssTarget: 'chrome61',
	// 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
	brotliSize: false,
	manifest: false,
	// chunk 大小警告的限制（以 kbs 为单位）
	chunkSizeWarningLimit: 1000,
	commonjsOptions: { ignore: [] },
	terserOptions: {
		compress: {
			keep_infinity: true,
			drop_console: true,
			drop_debugger: true,
		},
	},
	minify: 'terser',
};

export const defineConfigs: UserConfigExport = {
	css: {
		postcss: {
			plugins: [
				{
					postcssPlugin: 'internal:charset-removal',
					AtRule: {
						charset: (atRule: {
							name: string;
							remove: () => void;
						}) => {
							if (atRule.name === 'charset') {
								atRule.remove();
							}
						},
					},
				},
			],
		},
	},
	define: {
		__VUE_I18N_LEGACY_API__: false,
		__VUE_I18N_FULL_INSTALL__: false,
		__INTLIFY_PROD_DEVTOOLS__: false,
	},
};

export const rollupOptionsOutput = {
	// compact: true,
	chunkFileNames: 'static/js/[name]-[hash].js',
	entryFileNames: 'static/js/[name]-[hash].js',
	assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
	manualChunks(id: string | string[]) {
		if (id.includes('node_modules')) {
			return id
				.toString()
				.split('node_modules/')[1]
				.split('/')[0]
				.toString();
		}
	},
};
