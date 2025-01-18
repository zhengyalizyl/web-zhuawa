import path from 'path';
import { defineConfig,loadEnv, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { VitePWA } from 'vite-plugin-pwa'


function setupPlugins(env:ImportMetaEnv):PluginOption[] {
  return [
    react(),
    env.VITE_GLOB_APP_PWA==='true'&& VitePWA({
      injectRegister:'auto',
      manifest: {
        name: 'chatGPT',
        short_name: 'chatGPT',
        icons:[{
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
        ]
      },
    }),
  ]
}


// https://vite.dev/config/
export default defineConfig((env)=>{
  const viteEnv=loadEnv(env.mode,process.cwd()) as unknown as ImportMetaEnv;
  return {
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'src')
      }
    },
    plugins:setupPlugins(viteEnv),
    server:{
      host:'0.0.0.0',
      port:1002,
      open:false,
      proxy:{
        '/api':{
          target:viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin:true,
          rewrite: (path) => path.replace(/^\/api/, '')
      }
      }
    },
    build:{
      reportCompressedSizes:false,
      sourcemap:true,
      commonjsOptions:{
        ignoreTryCatch:false
      }
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      }
    }
  }
  })

