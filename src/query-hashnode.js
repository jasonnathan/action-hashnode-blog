import { post_link } from "./helpers.js";

const API_URL = "https://gql.hashnode.com";
const DEFAULT_HEADERS = {
  "Content-type": "application/json",
};

async function query_api(host, first = 6, after = null) {
  const query = `
  query GetPostsOfPublication(
    $host: String, 
    $first: Int!, 
    $after: String, 
    $filter: PublicationPostConnectionFilter
  ) {
    publication(host: $host) {
      id
      posts(first: $first, after: $after, filter: $filter) {
        totalDocuments
        edges {
          node {
            id
            title
            subtitle
            cuid
            publishedAt
            updatedAt
            url
            slug
            seo { description }
            coverImage { url }
            readTimeInMinutes
            author {
              id
              name
              username
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`;

  const variables = {
    host: host,
    first: first,
    after: after,
    filter: { deletedOnly: false },
  };

  const result = await fetch(API_URL, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ query, variables }),
  });

  const ApiResponse = await result.json();

  if (!ApiResponse.data.publication || !ApiResponse.data.publication.posts) {
    return [];
  }

  return ApiResponse.data.publication.posts.edges.map((edge) => edge.node);
}


export default async function (blogUrl, limit = 6) {
  let posts = await query_api(blogUrl, limit);
  if (!posts) return [];

  return posts.map((post) => ({
    ...post,
    url: post_link(post, blogUrl),
  }));
}
