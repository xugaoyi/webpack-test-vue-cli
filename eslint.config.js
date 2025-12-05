const js = require("@eslint/js");
const vue = require("eslint-plugin-vue");
const globals = require("globals");
const vueParser = require("vue-eslint-parser");

module.exports = [
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        parser: "@babel/eslint-parser",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
    },
    rules: {
      // 允许 index 作为组件名（因为 index.vue 是常见的目录入口文件命名）
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["index"],
        },
      ],
    },
  },
];
