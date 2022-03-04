import React, { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";
import { App } from "./App";

export const RefreshToken: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4040/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      try {
        const { accessToken } = await x.json();
        // console.log("aldkalf; ", accessToken);
        setAccessToken(accessToken);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  if (loading) {
    return <div>loading....</div>;
  }

  return <App />;
};
