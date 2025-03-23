import { defineConfig } from '@tanstack/react-start/config'
import type { PluginOption } from 'vite'; //TODO: delete this
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    server: {
        preset: 'netlify',
    },
    tsr: {
        appDirectory: 'app',
    },
    vite: {
        plugins: [
            tsConfigPaths({
                projects: ['./tsconfig.json'],
            }),
            tailwindcss() as PluginOption
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, "./app"),
            },
        },
    },
})