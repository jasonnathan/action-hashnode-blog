import { spawn } from "child_process";
import { join } from "path";

/**
 * Executes a shell command.
 * @param {string} cmd - The command to execute.
 * @param {string[]} args - Arguments to pass to the command.
 * @param {function} spawnFn - Optional function for testing (default: `spawn` from child_process).
 * @returns {Promise<number>} Resolves with exit code or rejects with error.
 */
export const exec = (cmd, args = [], spawnFn = spawn) => {
  return new Promise((resolve, reject) => {
    const app = spawnFn(cmd, args, { stdio: "inherit" });

    app.on("close", (code) => {
      if (code !== 0) {
        const err = new Error(`Invalid status code: ${code}`);
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });

    app.on("error", reject);
  });
};

/**
 * Commits the file using a shell script.
 * @param {string} scriptPath - The path to the commit script.
 * @param {function} spawnFn - Optional function for testing (default: `spawn` from child_process).
 * @returns {Promise<number>}
 */
export const commitFile = async (scriptPath = join(__dirname, "./commit.sh"), spawnFn = spawn) => {
  return exec("bash", [scriptPath], spawnFn);
};

export default commitFile;
