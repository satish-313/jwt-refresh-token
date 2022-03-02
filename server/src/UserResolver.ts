import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "./entity/User";
import { MyContext } from "./cnt";
import { createAccessToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponce {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi world";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id : ${payload?.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponce)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponce> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("wrong email , try again");
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      throw new Error("wrong password");
    }

    sendRefreshToken(res, user);

    // login successful

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => Int) userId: number) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, "tokenVersion", 1);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ) {
    const hashedPassword = await argon2.hash(password);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}
