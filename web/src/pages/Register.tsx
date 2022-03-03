import React, { useState } from "react";
import { RouteProps, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";

export const Register: React.FC<RouteProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submited");
          const responce = await register({
            variables: {
              email,
              password,
            },
          });

          console.log(responce)
          setEmail("");
          setPassword("");
          navigate("/", { replace: true });
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
          <button type="submit">register</button>
        </div>
      </form>
    </div>
  );
};
