import test from "ava";
import { list, blog } from "./display.js";

const mockPosts = [
  {
    id: "12345",
    title: "Understanding Asynchronous JavaScript",
    subtitle: "Promises, Callbacks, and Async/Explained",
    cuid: "abcd1234",
    publishedAt: "2025-02-09T02:49:15.029Z",
    updatedAt: "2025-02-27T06:19:54.900Z",
    url: "https://example.com/understanding-async-js",
    slug: "understanding-async-js",
    seo: {
      description: "Learn how JavaScript handles asynchronous operations with Promises, Callbacks, and Async/Await.",
    },
    coverImage: {
      url: "https://example.com/images/async-js.webp",
    },
    readTimeInMinutes: 5,
    author: {
      id: "author123",
      name: "Jane Doe",
      username: "janedoe",
    },
  },
  {
    id: "67890",
    title: "CSS Grid vs Flexbox: Choosing the Right Layout",
    subtitle: "A Practical Guide for Modern Web Design",
    cuid: "efgh5678",
    publishedAt: "2025-01-02T16:00:00.000Z",
    updatedAt: null,
    url: "https://example.com/css-grid-vs-flexbox",
    slug: "css-grid-vs-flexbox",
    seo: {
      description: "Understand when to use CSS Grid and when to opt for Flexbox in responsive web design.",
    },
    coverImage: {
      url: "https://example.com/images/css-layouts.webp",
    },
    readTimeInMinutes: 6,
    author: {
      id: "author456",
      name: "John Smith",
      username: "johnsmith",
    },
  },
];

const singlePost = [mockPosts[0]];
const emptyPosts = [];
const incompletePosts = [
  {
    id: "99999",
    title: "A Post Without an Image",
    subtitle: "Missing image but valid post",
    cuid: "xyz789",
    publishedAt: "2025-03-05T12:00:00.000Z",
    updatedAt: null,
    url: "https://example.com/no-image-post",
    slug: "no-image-post",
    seo: {},
    coverImage: {},
    readTimeInMinutes: 4,
    author: {
      id: "author999",
      name: "NoImageAuthor",
      username: "noimage",
    },
  },
];

test("list() returns empty string when no posts are available", (t) => {
  const output = list(emptyPosts, "list");
  t.is(output, "", "Should return an empty string when there are no posts");
});

test("blog() returns empty string when no posts are available", (t) => {
  const output = blog(emptyPosts, "blog");
  t.is(output, "", "Should return an empty string when there are no posts");
});

test("list() handles missing image and SEO description gracefully", (t) => {
  const output = list(incompletePosts, "list");
  t.is(
    output,
    `\n- [A Post Without an Image](https://example.com/no-image-post)`,
    "Should still generate valid output when image and description are missing"
  );
});

test("list() generates unordered markdown list", (t) => {
  const output = list(mockPosts, "list");
  t.is(
    output,
    `\n- [Understanding Asynchronous JavaScript](https://example.com/understanding-async-js)\n- [CSS Grid vs Flexbox: Choosing the Right Layout](https://example.com/css-grid-vs-flexbox)`
  );
});

test("list() generates ordered markdown list", (t) => {
  const output = list(mockPosts, "list-ordered");
  t.is(
    output,
    `\n1. [Understanding Asynchronous JavaScript](https://example.com/understanding-async-js)\n2. [CSS Grid vs Flexbox: Choosing the Right Layout](https://example.com/css-grid-vs-flexbox)`
  );
});

test("list() generates gist-style markdown list", (t) => {
  const output = list(mockPosts, "list-gist");
  t.is(
    output,
    `\n1. Understanding Asynchronous JavaScript\n2. CSS Grid vs Flexbox: Choosing the Right Layout`
  );
});

test("list() handles a single post correctly", (t) => {
  const output = list(singlePost, "list");
  t.is(
    output,
    `\n- [Understanding Asynchronous JavaScript](https://example.com/understanding-async-js)`,
    "Single post should still render correctly"
  );
});

test("blog() handles missing image and SEO description gracefully", (t) => {
  const output = blog(incompletePosts, "blog");

  t.true(
    output.includes('<h3><a href="https://example.com/no-image-post" title="A Post Without an Image">A Post Without an Image</a></h3>'),
    "Should correctly generate a title link"
  );

  t.false(output.includes('<img'), "Should not generate an image tag if no image is present");

  t.false(output.includes("undefined"), "Should not output 'undefined' anywhere in the markup");
});


test("blog() formats blog layout correctly", (t) => {
  const output = blog(mockPosts, "blog");
  t.true(output.includes("<h3>"));
  t.true(output.includes("<p>"));
  t.true(output.includes("<strong>"));
  t.true(output.includes("Understanding Asynchronous JavaScript"));
});

test("blog() handles a single post correctly", (t) => {
  const output = blog(singlePost, "blog");
  t.true(output.includes("<h3>"));
  t.true(output.includes("Understanding Asynchronous JavaScript"));
});

test("blog() handles alternate layout (blog-left/blog-right)", (t) => {
  const output = blog(mockPosts, "blog-alternate");
  t.true(output.includes(`<img src="https://example.com/images/async-js.webp" alt="Understanding Asynchronous JavaScript" width="250px" align="left" />`));
  t.true(output.includes(`<img src="https://example.com/images/css-layouts.webp" alt="CSS Grid vs Flexbox: Choosing the Right Layout" width="250px" align="right" />`));
});

test("blog() formats grid-style blog layout", (t) => {
  const output = blog(mockPosts, "blog-grid-2");
  t.true(output.includes("<table>"));
  t.true(output.includes("<td>"));
});

test("blog() formats grid layout with 3 columns correctly", (t) => {
  const output = blog(mockPosts, "blog-grid-3");
  t.true(output.includes("<table>"));
  t.true(output.includes("<td>"));
});

test("blog() correctly formats date parsing", (t) => {
  const output = blog(mockPosts, "blog");
  t.true(output.includes("<strong>9 Feb 2025</strong>"), "Published date should be parsed correctly");
  t.true(output.includes("| <strong>Updated: 27 Feb 2025</strong>"), "Updated date should be parsed correctly");
});

test("blog() does not shuffle order of posts", (t) => {
  const output = blog(mockPosts, "blog");
  const index1 = output.indexOf("Understanding Asynchronous JavaScript");
  const index2 = output.indexOf("CSS Grid vs Flexbox: Choosing the Right Layout");
  t.true(index1 < index2, "The first post should appear before the second");
});
