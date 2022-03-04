import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "./accessToken";
import { RefreshToken } from "./RefreshToken";
import jwtDecode from "jwt-decode";

const httpLink = createHttpLink({
  uri: "http://localhost:4040/graphql",
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  let token = getAccessToken();
  console.log("before token", token);
  const { exp }: any = jwtDecode(token);

  if (Date.now() >= exp * 1000) {
    console.log("expire");
    const res = await fetch("http://localhost:4040/refresh_token", {
      method: "POST",
      credentials: "include",
    });
    const { accessToken } = await res.json();
    token = accessToken;
  }

  console.log("after fetch ", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  // uri: "http://localhost:4040/graphql",
  // link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <RefreshToken />
  </ApolloProvider>,
  document.getElementById("root")
);
