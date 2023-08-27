import { exec } from "child_process";

export default () => ({
  name: "tsc",
  setup(build) {
    build.onEnd((result) => {
      return new Promise(async (resolve, reject) => {
        const cmd = "npx tsc --incremental --noEmit --pretty --skipLibCheck --project tsconfig.json";
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
