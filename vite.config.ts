import path from "path";
import { defineConfig } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Unocss from "unocss/vite";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import VueTypeImports from "@zolyn/vite-plugin-vue-type-imports";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`
    }
  },
  server: {
    port: 3002,
  },
  plugins: [
    Vue(),
    VueTypeImports(),
    Components({
      dirs: ["src/components"],
      dts: "src/components.d.ts",
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        })
      ]
    }),
    ElementPlus({
      defaultLocale: "ru",
      useSource: true
    }) as Plugin,
    Inspect()
  ]
});
