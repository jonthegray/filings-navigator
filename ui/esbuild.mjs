import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import eslintPlugin from "./esbuild-plugin-eslint.mjs";
import tscPlugin from "./esbuild-plugin-tsc.mjs";

const config = {
  bundle: true,
  entryPoints: {
    "reactRoot": "./root/react-root.ts",
    "styles": "./root/styles.scss"
  },
  logLevel: "info",
  outdir: "../app/assets/react",
  plugins: [
    sassPlugin(),
    tscPlugin(),
    eslintPlugin()
  ],
  sourcemap: true,
  target: [
    "chrome104",
    "firefox104"
  ]
};

if (process.env.WATCH) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
} else {
  const result = await esbuild.build(config);
  if (result.errors.length > 0) {
    process.exit(1);
  }
}
