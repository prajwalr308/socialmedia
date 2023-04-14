import { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";


export const filterUserForClient = (user: User) => {
    let username = "";
    if (user.username) {
      username = user.username;
    } else if (user.firstName && user.lastName) {
      username = `${user.firstName}.${user.lastName}`;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User has no username or name",
      });
    }
  
    return {
      id: user.id,
      username: username,
      profileImageUrl: user.profileImageUrl,
    };
  };