import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-unfetch";
import { RestLink } from "apollo-link-rest";
import PolyfillHeaders from "fetch-headers";

// Polyfills
if (global.Headers == null) {
  global.Headers = PolyfillHeaders;
}

if (!process.browser) {
  global.fetch = fetch;
}

let apolloClient = null;

const cache = new InMemoryCache();
const restLink = new RestLink({
  uri: "http://localhost:3000/api/",
  // uri: "https://hilton.aarondancer.com/api/",
  customFetch: fetch,
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "same-origin"
});

function create(initialstate) {
  return new ApolloClient({
    link: ApolloLink.from([restLink]),
    cache
  });
}

export default function initApollo(initialState) {
  if (!process.browser) {
    return create(initialState);
  }

  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
