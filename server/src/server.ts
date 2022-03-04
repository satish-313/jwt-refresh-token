import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken } from "./auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";

const main = async () => {
  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.get("/", (_, res) => {
    res.send("hello the world");
  });

  app.post("/refresh_token", async (req, res) => {
    let cookie = req.headers.cookie;
    if (!cookie) {
      return res.json("error no cookie");
    }
    // console.log(cookie)
    let cookies: string[] = cookie.split(";");
    let cookieObj = cookies.map((c) => {
      interface makeObj {
        [index: string]: string;
      }
      let tempC: string[];
      let obj: makeObj = {};
      if (c[0] !== " ") {
        tempC = c.split("=");

        obj[`${tempC[0]}`] = tempC[1];
        return obj;
      }
      let str: string = c.split(" ")[1];
      tempC = str.split("=");
      obj[`${tempC[0]}`] = tempC[1];
      return obj;
    });

    let index: number = -1;

    for (let i = 0; i < cookieObj.length; i++) {
      if (Object.keys(cookieObj[i])[0] === "gen") {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return res.send({ ok: false, accessToken: "" });
    }

    const token = cookieObj[index].gen;
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      console.log(error);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, user);

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection();

  const apolloserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloserver.start();
  apolloserver.applyMiddleware({ app , cors: false});

  app.listen(4040, () => {
    console.log("server is running on post 4040");
  });
};

main().catch((err) => {
  console.log(err);
});
