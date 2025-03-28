// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

/** @type {import('eslint').Linter.Config[]} */
const config =  [
    ...compat.extends("next/core-web-vitals"),
    {
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"],
        },
    },
];

export default config;
