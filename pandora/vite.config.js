import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": "/src",
            "@components":"/src/components/editor_components"
        }   
    }
});