import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'  // ⭐ 导入 loadEnv
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  // ⭐ 改为函数形式，接收 mode
    // ⭐ 加载环境变量
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver(
                    { importStyle: 'sass' }
                )],
            }),
            Components({
                resolvers: [ElementPlusResolver(
                    { importStyle: 'sass' }
                )],
            }),
            ElementPlus({
                useSource: true,
            }),
        ],

        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },

        server: {
            port: 5173,
            open: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:9090',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },

        // ⭐ 关键：添加 define 配置，暴露环境变量给代码
        define: {
            'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
        },

        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                    additionalData: `@use "@/assets/css/index.scss" as *;`
                },
                sass: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                }
            }
        }
    }
})