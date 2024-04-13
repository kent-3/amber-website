import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// vite.config.js
export default {
    base: "/amber-website/",
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
            ],
        },
    },
};
