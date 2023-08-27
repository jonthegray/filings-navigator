import { exec } from "child_process";

export default (isProd) => ({
  name: "tsc",
  setup(build) {
    build.onEnd((result) => {
      return new Promise(async (resolve, reject) => {
        const config = isProd ? "tsconfig.prod.json" : "tsconfig.json";
        const cmd = `npx tsc --incremental --noEmit --pretty --skipLibCheck --project ${config}`;
        console.log("Typechecking...");

        await exec(cmd, (error, stdout) => {
          if (stdout) {
            console.log(stdout);
            result.errors.push({ text: "Type errors found" });
          } else {
            console.log("No type errors");
          }
          resolve();
        });
      });
    });
  }
});
