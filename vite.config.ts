import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tsConfigPaths from "vite-tsconfig-paths"

// TODO: handle error propagation
// TODO: handle all expected and unexpected errors

export default defineConfig({
  plugins: [
    nitro(),
    tsConfigPaths(),
    tanstackStart(),
    VitePWA({
      devOptions: { enabled: true },
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
            src: "./assets/icons/72x72.png",
            type: "image/png",
          },
          {
            sizes: "128x128",
            src: "./assets/icons/128x128.png",
            type: "image/png",
          },
          {
            sizes: "144x144",
            src: "./assets/icons/144x144.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "./assets/icons/192x192.png",
            type: "image/pnsg",
          },
          {
            sizes: "512x512",
            src: "./assets/icons/512x512.png",
            type: "image/png",
          },
        ],
        id: "https://loops.tn?version=2",
        name: "Loops - Digital skills learning app for kids",
        orientation: "portrait",
        screenshots: [
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/1.jpg",
            type: "image/jpg",
          },
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/2.jpg",
            type: "image/jpg",
          },
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/3.jpg",
            type: "image/jpg",
          },
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/4.jpg",
            type: "image/jpg",
          },
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/5.jpg",
            type: "image/jpg",
          },
          {
            sizes: "1080x1920",
            src: "./assets/screenshots/6.jpg",
            type: "image/jpg",
          },
        ],
        short_name: "Loops",
        start_url: "/",
        theme_color: "#31BCE6",
      },
      registerType: "autoUpdate",
    }),
    tailwindcss(),
    viteReact(),
  ],
  server: {
    port: 3001,
  },
})
