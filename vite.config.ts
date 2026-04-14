import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import fs from "node:fs/promises"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tsConfigPaths from "vite-tsconfig-paths"

// TODO: handle error propagation
// TODO: handle all expected and unexpected errors

const nitroRawPrefix = "nitro:raw:"
const nitroRawResolvedPrefix = "\0nitro:raw:"
const nitroRawJsonProxyPrefix = "\0nitro-raw-json:"
const nitroRawJsonProxySuffix = ".txt"
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN

export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      maxParallelFileOps: 10,
    },
    sourcemap: "hidden",
  },
  plugins: [
    {
      enforce: "pre",
      load: {
        async handler(id) {
          if (id.startsWith(nitroRawPrefix) && id.endsWith(".json")) {
            const filePath = id.slice(nitroRawPrefix.length)
            const raw = await fs.readFile(filePath, "utf8")
            return `export default ${JSON.stringify(raw)}`
          }

          if (id.startsWith(nitroRawResolvedPrefix) && id.endsWith(".json")) {
            const filePath = id.slice(nitroRawResolvedPrefix.length)
            const raw = await fs.readFile(filePath, "utf8")
            return `export default ${JSON.stringify(raw)}`
          }

          if (!id.startsWith(nitroRawJsonProxyPrefix)) return null

          const filePathWithSuffix = id.slice(nitroRawJsonProxyPrefix.length)
          const filePath = filePathWithSuffix.endsWith(nitroRawJsonProxySuffix)
            ? filePathWithSuffix.slice(0, -nitroRawJsonProxySuffix.length)
            : filePathWithSuffix

          const raw = await fs.readFile(filePath, "utf8")
          return `export default ${JSON.stringify(raw)}`
        },
        order: "pre",
      },
      name: "nitro-raw-json-proxy",
      resolveId: {
        handler(id) {
          if (id.startsWith(nitroRawPrefix) && id.endsWith(".json")) {
            return `${nitroRawJsonProxyPrefix}${id.slice(
              nitroRawPrefix.length,
            )}${nitroRawJsonProxySuffix}`
          }

          if (id.startsWith(nitroRawResolvedPrefix) && id.endsWith(".json")) {
            return `${nitroRawJsonProxyPrefix}${id.slice(
              nitroRawResolvedPrefix.length,
            )}${nitroRawJsonProxySuffix}`
          }

          return null
        },
        order: "pre",
      },
    },
    nitro({
      experimental: {
        vite: {
          assetsImport: false,
        },
      },
      sourcemap: true,
    }),
    tsConfigPaths(),
    tanstackStart(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      manifest: {
        background_color: "#000016",
        categories: ["education"],
        description: `
          Loops – Learn Coding Through Play! 🧠🎮
          Loops is the ultimate app to help kids discover the world of coding in a fun, engaging, and competitive way! Designed specifically for young learners, Loops teaches essential digital skills through interactive lessons, playful challenges, and gamified experiences.

          🧩 Why Kids Love Loops:
          - 🚀 Learn to code step by step through games and interactive activities
          - 🏆 Unlock badges and rewards as you progress
          - ⚔️ Join competitive quiz rooms to test your skills against friends
          - 🎮 Gamified lessons that turn learning into an adventure
          - 👾 Fun characters and kid-friendly design for ages 9–16

          💡 Whether your child is just starting out or looking to level up their tech skills, Loops makes learning coding easy, exciting, and effective!
        `,
        display: "fullscreen",
        icons: [
          {
            sizes: "72x72",
            src: "/icons/72x72.png",
            type: "image/png",
          },
          {
            sizes: "128x128",
            src: "/icons/128x128.png",
            type: "image/png",
          },
          {
            sizes: "144x144",
            src: "/icons/144x144.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "/icons/192x192.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "/icons/512x512.png",
            type: "image/png",
          },
        ],
        id: "https://app.loops.tn",
        name: "Loops - Digital skills learning app for kids",
        orientation: "portrait",
        screenshots: [
          {
            sizes: "1080x1920",
            src: "/screenshots/1.jpg",
            type: "image/jpeg",
          },
          {
            sizes: "1080x1920",
            src: "/screenshots/2.jpg",
            type: "image/jpeg",
          },
          {
            sizes: "1080x1920",
            src: "/screenshots/3.jpg",
            type: "image/jpeg",
          },
          {
            sizes: "1080x1920",
            src: "/screenshots/4.jpg",
            type: "image/jpeg",
          },
          {
            sizes: "1080x1920",
            src: "/screenshots/5.jpg",
            type: "image/jpeg",
          },
          {
            sizes: "1080x1920",
            src: "/screenshots/6.jpg",
            type: "image/jpeg",
          },
        ],
        short_name: "Loops",
        start_url: "/",
        theme_color: "#31BCE6",
      },
      registerType: "autoUpdate",
      workbox: {
        globDirectory: ".output/public",
        globIgnores: ["**/country-codes.json"],
      },
    }),
    tailwindcss(),
    viteReact(),
    ...(sentryAuthToken
      ? [
          sentryTanstackStart({
            authToken: sentryAuthToken,
            org: "opuslab-edtech-95",
            project: "loops-app",
            sourcemaps: {
              assets: ["./.output/**/*", "./dist/**/*"],
              filesToDeleteAfterUpload: [
                "./.output/**/*.map",
                "./dist/**/*.map",
              ],
            },
            telemetry: false,
          }),
        ]
      : []),
  ],
})
