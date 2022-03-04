import React from "react";
import { useByeQuery } from "../generated/graphql";

interface Props {}

export const Bye: React.FC<Props> = () => {
  const { data, error, loading } = useByeQuery({ fetchPolicy: "network-only" });

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    console.log("token expire" ,error);
    return <div>error</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return <div>bye {data.bye}</div>;
};
