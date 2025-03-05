import test from "ava";
import esmock from "esmock";

// 🛠 Mock Fetch Globally
global.fetch = async (url, options) => {
  const { query, variables } = JSON.parse(options.body);

  if (!variables.host) {
    return {
      json: async () => ({ data: { publication: null } })
    };
  }

  if (variables.host === "empty-blog") {
    return {
      json: async () => ({
        data: { publication: { posts: { edges: [] } } }
      })
    };
  }

  return {
    json: async () => ({
      data: {
        publication: {
          posts: {
            edges: [
              {
                node: {
                  id: "12345",
                  title: "Understanding Async in JavaScript",
                  subtitle: "Exploring async, await, and Promises in JavaScript.",
                  cuid: "async123",
                  publishedAt: "2025-02-09T02:49:15.029Z",
                  updatedAt: null,
                  url: "https://example.com/understanding-async",
                  slug: "understanding-async",
                  seo: {
                    description: "A beginner-friendly guide to async programming in JavaScript."
                  },
                  coverImage: {
                    url: "https://example.com/image1.jpg"
                  },
                  readTimeInMinutes: 6,
                  author: {
                    id: "author123",
                    name: "John Doe",
                    username: "johndoe"
                  }
                }
              }
            ]
          }
        }
      }
    })
  };
};

// 🛠 Load `query-hashnode.js` with Mocks
const queryHashnode = await esmock("../src/query-hashnode.js", {
  "../src/helpers.js": {
    post_link: (post, blogUrl) => post.url || `https://${blogUrl}/p/${post.slug}`
  }
});

// 📝 TEST SUITE

test("query_api() retrieves posts correctly", async (t) => {
  const posts = await queryHashnode.default("example.com", 5);
  t.is(posts.length, 1);
  t.is(posts[0].title, "Understanding Async in JavaScript");
  t.is(posts[0].seo.description, "A beginner-friendly guide to async programming in JavaScript.");
  t.is(posts[0].coverImage.url, "https://example.com/image1.jpg");
  t.is(posts[0].url, "https://example.com/understanding-async");
});

test("query_api() returns an empty array for blogs with no posts", async (t) => {
  const posts = await queryHashnode.default("empty-blog", 5);
  t.deepEqual(posts, []);
});

test("query_api() gracefully handles invalid blog URLs", async (t) => {
  const posts = await queryHashnode.default(null, 5);
  t.deepEqual(posts, []);
});

test("query_api() correctly formats post URLs with post_link()", async (t) => {
  const posts = await queryHashnode.default("example.com", 5);
  t.is(posts[0].url, "https://example.com/understanding-async");
});
