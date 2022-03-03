import React, { useState } from "react";
import { useLoginMutation } from "../generated/graphql";

interface Props {}

export const Login: React.FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submited");
          const responce = await login({
            variables: {
              email,
              password,
            },
          });

          console.log(responce);
          setEmail("");
          setPassword("");
        }}
      >
        <div>
          <input
            type="email"
            placeholder="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );
};
