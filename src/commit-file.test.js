import test from "ava";
import esmock from "esmock";

/**
 * Mock `spawn` function for testing
 */
const spawnMock = (cmd, args) => {
  return {
    on: (event, callback) => {
      if (event === "close") callback(0); // Simulate successful execution
    },
  };
};

// 🛠 Load `commit-file.js` with mock spawn
const { exec, commitFile } = await esmock("../src/commit-file.js", {
  "child_process": {
    spawn: spawnMock,
  },
  path: {
    join: (...args) => args.join("/"), // Mock join for consistency
  },
});

// ✅ Test `exec()` function
test("exec() runs command successfully", async (t) => {
  const exitCode = await exec("echo", ["Hello"], spawnMock);
  t.is(exitCode, 0, "exec should return exit code 0 on success");
});

// ✅ Test `commitFile()` function
test("commitFile() runs commit script successfully", async (t) => {
  const exitCode = await commitFile("./mock-commit.sh", spawnMock);
  t.is(exitCode, 0, "commitFile should return exit code 0 on success");
});

// ✅ Test `exec()` failure handling
test("exec() rejects on non-zero exit code", async (t) => {
  const failingSpawnMock = (cmd, args) => ({
    on: (event, callback) => {
      if (event === "close") callback(1); // Simulate failure
    },
  });

  await t.throwsAsync(() => exec("failcmd", [], failingSpawnMock), {
    message: /Invalid status code: 1/,
  });
});
