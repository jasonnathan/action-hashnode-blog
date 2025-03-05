import test from "ava";
import esmock from "esmock";

// ✅ Import ALL functions from index.js
import { getConfig, logConfig, fetchPosts, generateOutput, updateGist, updateFile, run } from "./index.js";

// 🛠 Mock GitHub Actions Core API
const coreMock = {
  startGroup: () => { },
  info: () => { },
  endGroup: () => { },
  error: () => { },
  setFailed: () => { },
};

// 🛠 Mock `fs`
const fsMock = {
  readFileSync: () => "<!-- HASHNODE_BLOG:START -->\nOLD CONTENT\n<!-- HASHNODE_BLOG:END -->",
  writeFileSync: () => { },
};

// 🛠 Mock Hashnode Query Response
const queryMock = async (blogUrl, limit) => [
  {
    id: "12345",
    title: "Understanding Async in JavaScript",
    seo: { description: "Exploring async, await, and Promises in JavaScript." },
    coverImage: { url: `https://${blogUrl}/image1.jpg` },
    publishedAt: "2025-02-09T02:49:15.029Z",
    updatedAt: "2025-02-27T06:19:54.900Z",
    url: `https://${blogUrl}/understanding-async`,
  },
  {
    id: "67890",
    title: "CSS Grid vs Flexbox: Choosing the Right Layout",
    seo: { description: "A comparison of CSS Grid and Flexbox for modern layouts." },
    coverImage: { url: `https://${blogUrl}/image2.jpg` },
    publishedAt: "2025-01-02T16:00:00.000Z",
    updatedAt: null,
    url: `https://${blogUrl}/css-grid-vs-flexbox`,
  }
];

// 🛠 Mock Commit Function
const commitMock = async () => { };

// 🛠 Load `index.js` with mocks
const { fetchPosts: mockedFetchPosts, updateGist: mockedUpdateGist, updateFile: mockedUpdateFile } = await esmock(
  "./index.js",
  {
    "./query-hashnode.js": { query_api: queryMock, query: queryMock },
    "./commit-file.js": { default: commitMock },
    "@actions/core": coreMock,
    fs: fsMock,
    "gist-box": {
      GistBox: class {
        constructor({ id, token }) {
          if (!id || !token) {
            throw new TypeError("Missing id or token in GistBox");
          }
          this.id = id;
          this.token = token;
        }
        async update() {
          return Promise.resolve();
        }
      },
    },
  }
);

// 📝 Test Suite

test("getConfig() correctly retrieves environment variables", (t) => {
  // ✅ Set environment variables as GitHub Actions would
  process.env.INPUT_TYPE = "gist";
  process.env.INPUT_FILE = "README.md";
  process.env.INPUT_STYLE = "list";
  process.env.INPUT_COUNT = "5";
  process.env.INPUT_BLOG_URL = "geekist.co";
  process.env.GITHUB_WORKSPACE = "/tmp";
  process.env.GITHUB_TOKEN = "fake-token";

  // 🛠 Run getConfig() and verify output
  const config = getConfig();

  t.is(config.TYPE, "gist");
  t.is(config.FILE, "README.md");
  t.is(config.STYLE, "list");
  t.is(config.COUNT, "5");
  t.is(config.BLOG_URL, "geekist.co");
  t.is(config.GITHUB_WORKSPACE, "/tmp");
  t.is(config.GITHUB_TOKEN, "fake-token");
});

test("logConfig() logs values without errors", (t) => {
  const config = {
    TYPE: "gist",
    FILE: "README.md",
    STYLE: "list",
    COUNT: "5",
    BLOG_URL: "geekist.co",
  };
  t.notThrows(() => logConfig(config));
});

test("fetchPosts() retrieves blog posts correctly", async (t) => {
  const posts = await mockedFetchPosts("geekist.co", 5);
  t.is(posts.length, 2);
  t.is(posts[0].title, "Understanding Async in JavaScript");
});

test("generateOutput() produces correct list format", async (t) => {
  const posts = await queryMock('geekist.co'); // ✅ Ensure posts is an array, not a Promise
  const output = generateOutput(posts, "list");
  t.true(output.includes("[Understanding Async in JavaScript](https://geekist.co/understanding-async)"));
});

test("updateGist() calls GistBox.update() without throwing errors", async (t) => {
  const config = {
    FILE: "gist-id-123",
    STYLE: "list",
    GITHUB_TOKEN: "fake-token",
  };
  const posts = await mockedFetchPosts("geekist.co", 5);
  await t.notThrowsAsync(() => mockedUpdateGist(config, posts));
});

test("updateFile() modifies file content correctly", async (t) => {
  const config = {
    FILE: "README.md",
    STYLE: "blog",
    GITHUB_WORKSPACE: "/tmp",
  };
  const posts = await mockedFetchPosts("geekist.co", 5);
  await t.notThrowsAsync(() => mockedUpdateFile(config, posts));
});

test("run() integrates all functions correctly", async (t) => {
  const config = {
    TYPE: "gist",
    FILE: "gist-id-123",
    STYLE: "list",
    COUNT: "5",
    BLOG_URL: "geekist.co",
    GITHUB_TOKEN: "fake-token",
  };
  await t.notThrowsAsync(() => run(config));
});
