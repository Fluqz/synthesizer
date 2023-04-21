import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      // onwarn: (warning, defaultHandler) => {
      //   // Ignore a11y-click-events-have-key-events warning from sveltestrap
      //   // This ignore can be removed after this issue is closed https://github.com/bestguy/sveltestrap/issues/509.
      //   if (warning.code === 'a11y-click-events-have-key-events' && warning.filename?.startsWith('/node_modules/sveltestrap')) return;
      //   defaultHandler(warning);
      // },
      compilerOptions: {

      }
    })
  ]
})
