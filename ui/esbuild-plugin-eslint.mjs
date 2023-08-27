import { ESLint } from "eslint";

// Inspired by https://github.com/robinloeffel/esbuild-plugin-eslint
export default (options) => ({
  name: "eslint",
  setup(build) {
    const eslint = new ESLint(options);
    const filesToLint = [];

    build.onLoad({ filter: /\.(js|tsx?)$/ }, ({ path }) => {
      if (!path.includes("node_modules")) {
        filesToLint.push(path);
      }
    });

    build.onEnd(async (result) => {
      const lintResult = await eslint.lintFiles(filesToLint);
      const formatter = await eslint.loadFormatter("stylish");

      const output = formatter.format(lintResult);
      if (output.length > 0) {
        console.log(output);
        result.errors.push({ text: "ESLint failed" });
      }
    });
  }
});
