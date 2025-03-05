import test from "ava";
import {
  atag,
  imgtag,
  post_link,
  image_size,
  parseDate,
  formatDateRange
} from "../src/helpers.js";

// ✅ `atag()` Function
test("atag() generates correct anchor tag", (t) => {
  const result = atag("https://example.com", "Example Title", "Click Here");
  t.is(result, `<a href="https://example.com" title="Example Title">Click Here</a>`);
});

test("atag() returns content only if link is empty", (t) => {
  const result = atag("", "Example Title", "Click Here");
  t.is(result, "Click Here");
});

// ✅ `imgtag()` Function
test("imgtag() generates image wrapped in anchor", (t) => {
  const result = imgtag("https://example.com/image.jpg", "https://example.com", "Example Image");
  t.is(result, `<a href="https://example.com" title="Example Image"><img src="https://example.com/image.jpg" alt="Example Image" /></a>`);
});

test("imgtag() handles missing image source gracefully", (t) => {
  const result = imgtag("", "https://example.com", "Example Image");
  t.is(result, "");
});

test("imgtag() includes width and alignment attributes", (t) => {
  const result = imgtag("https://example.com/image.jpg", "https://example.com", "Example Image", "left", "250px");
  t.is(result, `<a href="https://example.com" title="Example Image"><img src="https://example.com/image.jpg" alt="Example Image" width="250px" align="left" /></a>`);
});

// ✅ `post_link()` Function
test("post_link() returns existing post URL", (t) => {
  const post = { url: "https://example.com/post" };
  const result = post_link(post, "blog.com");
  t.is(result, "https://example.com/post");
});

test("post_link() constructs URL from slug when missing", (t) => {
  const post = { slug: "example-slug" };
  const result = post_link(post, "blog.com");
  t.is(result, "https://blog.com/p/example-slug");
});

// ✅ `image_size()` Function
test("image_size() returns small, large, or default correctly", (t) => {
  t.is(image_size("small", "default", "100px", "500px"), "100px");
  t.is(image_size("large", "default", "100px", "500px"), "500px");
  t.is(image_size("", "default", "100px", "500px"), "default");
  t.is(image_size("other", "default", "100px", "500px"), "other");
});

// ✅ `parseDate()` Function
test("parseDate() formats a valid date correctly", (t) => {
  t.is(parseDate("2025-02-09T02:49:15.029Z"), "9 Feb 2025");
});

test("parseDate() handles invalid date strings", (t) => {
  t.is(parseDate("invalid-date"), "Invalid Date");
});

test("parseDate() returns 'Unknown Date' when date is null/undefined", (t) => {
  t.is(parseDate(null), "Unknown Date");
  t.is(parseDate(undefined), "Unknown Date");
});

// ✅ `formatDateRange()` Function
test("formatDateRange() formats published and updated dates", (t) => {
  const result = formatDateRange("2025-02-09T02:49:15.029Z", "2025-02-27T06:19:54.900Z");
  t.is(result, `<div><strong>9 Feb 2025</strong> | <strong>Updated: 27 Feb 2025</strong></div>`);
});

test("formatDateRange() excludes updated date if null", (t) => {
  const result = formatDateRange("2025-02-09T02:49:15.029Z", null);
  t.is(result, `<div><strong>9 Feb 2025</strong></div>`);
});

test("formatDateRange() excludes updated date if invalid", (t) => {
  const result = formatDateRange("2025-02-09T02:49:15.029Z", "invalid-date");
  t.is(result, `<div><strong>9 Feb 2025</strong></div>`);
});
