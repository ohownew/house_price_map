import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_MAPBOX_KEY)
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/examples': {
          target: 'https://echarts.apache.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/examples/, '')
        }
      }
    },
    // 全局变量
    define: {
      VITE_MAPBOX_KEY: JSON.stringify(env.VITE_MAPBOX_KEY)
    },
  }

})
