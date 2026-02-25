import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      setupFiles: ['./src/test/setup.ts'],
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/i18n/index.ts',
          'src/styles/**',
          'src/test/**',
          'src/**/index.ts',
          'src/types/**',
        ],
        thresholds: {
          statements: 80,
          branches: 75,
          functions: 85,
        },
      },
    },
  }),
)
