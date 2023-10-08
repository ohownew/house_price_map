import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_MAPBOX_KEY)
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/examples': {
          target: 'https://echarts.apache.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/examples/, '')
        },
        '/api': {
          target: 'http://127.0.0.1:3001/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 全局变量
    define: {
      VITE_MAPBOX_KEY: JSON.stringify(env.VITE_MAPBOX_KEY)
    },
  }

})
