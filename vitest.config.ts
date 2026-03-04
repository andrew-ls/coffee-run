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
          'src/app/main.tsx',
          'src/shared/i18n/index.ts',
          'src/app/styles/**',
          'src/test/**',
          'src/**/index.ts',
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
