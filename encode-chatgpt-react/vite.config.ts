import path from 'path';
import { defineConfig,loadEnv, PluginOption } from 'vite'
import react from '@vitejs/plugin-react' //react插件
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { VitePWA } from 'vite-plugin-pwa'

console.log(import.meta)//这个console得在tsconfig.node.json的lib里面配置DOM
//要在vite-env.d.ts里面配置，同时需要在tsconfig.node.json里面配置
function setupPlugins(env:ImportMetaEnv):PluginOption[] {
  return [
    react(),//插件化机制
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
      port:1002,
      open:false,//默认不打开
      proxy:{
        '/api':{
          target:viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin:true,
          rewrite: (path) => path.replace(/^\/api/, '')
      }
      }
    },
    //生产构建配置

    build:{
      reportCompressedSizes:false,
      sourcemap:true,//一般情况下都不能直接将sourcemap放到生产环境,因为会暴露源码
      //sourcemap 是什么？如果不能上传到生产环境的话，怎么定位线上报错问题？
      //企业级性能与异常监控平台，会托管sourcemap 文件，通过sourcemap 文件定位到源码
      commonjsOptions:{
        ignoreTryCatch:false
      },
      // chunkSizeWarningLimit:200,
      rollupOptions:{
        output:{
          manualChunks: {
            "react-lib": ['react', 'react-dom']
          }
        }
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

