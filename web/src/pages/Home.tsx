import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, error, loading } = useUsersQuery({
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    console.log(error)
    return <div>error</div>;
  }

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>users : </div>
      <ul>
        {data.users.map((u) => (
          <li key={u.id}>
            {u.id} : {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
