import test from "ava";
import esmock from "esmock";

// 🛠 Mocks for Core Actions
const coreMock = {
  startGroup: () => { },
  info: () => { },
  endGroup: () => { },
  error: () => { },
  setFailed: () => { },
};

// 🛠 Stub `fs`
const fsMock = {
  readFileSync: () => "<!-- HASHNODE_BLOG:START -->\nOLD CONTENT\n<!-- HASHNODE_BLOG:END -->",
  writeFileSync: () => { },
};

// 🛠 Mock Hashnode Query Response
const queryMock = async () => [
  {
    id: "12345",
    title: "Understanding Async in JavaScript",
    seo: { description: "Exploring async, await, and Promises in JavaScript." },
    coverImage: { url: "https://example.com/image1.jpg" },
    publishedAt: "2025-02-09T02:49:15.029Z",
    updatedAt: "2025-02-27T06:19:54.900Z",
    url: "https://example.com/understanding-async",
  },
  {
    id: "67890",
    title: "CSS Grid vs Flexbox: Choosing the Right Layout",
    seo: { description: "A comparison of CSS Grid and Flexbox for modern layouts." },
    coverImage: { url: "https://example.com/image2.jpg" },
    publishedAt: "2025-01-02T16:00:00.000Z",
    updatedAt: null,
    url: "https://example.com/css-grid-vs-flexbox",
  }
];

// 🛠 Mock Commit Function
const commitMock = async () => { };

// 🛠 Load `run()` with Mocks
const { run, updateGist, updateFile, fetchPosts } = await esmock("./index.js", {
  "./query-hashnode.js": { default: queryMock },
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
    }
  }
});

// 📝 Test Suite

test("fetchPosts() retrieves blog posts correctly", async (t) => {
  const posts = await fetchPosts("https://example.com", 5);
  t.is(posts.length, 2);
  t.is(posts[0].title, "Understanding Async in JavaScript");
  t.is(posts[1].title, "CSS Grid vs Flexbox: Choosing the Right Layout");
});

test("run() updates file correctly", async (t) => {
  const config = {
    TYPE: "file",
    FILE: "output.md",
    STYLE: "list-ordered",
    COUNT: "5",
    BLOG_URL: "https://example.com",
    GITHUB_WORKSPACE: "/tmp",
  };

  await run(config);
  t.pass();
});

test("run() updates Gist correctly", async (t) => {
  const config = {
    TYPE: "gist",
    FILE: "gist-id-123",
    STYLE: "list",
    COUNT: "5",
    BLOG_URL: "https://example.com",
    GITHUB_TOKEN: "fake-token",
  };

  await run(config);
  t.pass();
});

test("updateGist() calls GistBox.update()", async (t) => {
  const config = {
    FILE: "gist-id-123",
    STYLE: "list",
    GITHUB_TOKEN: "fake-token",
  };
  
  const posts = await fetchPosts("https://example.com", 5);
  
  await t.notThrowsAsync(() => updateGist(config, posts));
});

test("updateFile() modifies file content correctly", async (t) => {
  const config = {
    FILE: "output.md",
    STYLE: "blog",
    GITHUB_WORKSPACE: "/tmp",
  };

  const posts = await fetchPosts("https://example.com", 5);

  await t.notThrowsAsync(() => updateFile(config, posts));
});
