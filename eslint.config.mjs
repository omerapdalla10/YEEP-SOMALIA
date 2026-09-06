import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Content images are remote (Unsplash) or inline data URLs with dynamic
      // refs; plain <img> is intentional here — next/image adds no real benefit.
      "@next/next/no-img-element": "off",
      // Marketing copy contains apostrophes and ampersands in prose.
      "react/no-unescaped-entities": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "legacy/**",
    "gitignore.scaffold",
  ]),
]);

export default eslintConfig;
