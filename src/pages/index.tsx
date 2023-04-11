import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { z } from "zod";

dayjs.extend(relativeTime);
const CreatPostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile"
        width={48}
        height={48}
        className="rounded-full"
      />
      <input
        placeholder="Enter a text"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className=" flex gap-3 border-b border-slate-400 p-4 ">
      <Image
        src={author.profileImageUrl}
        alt={`${author.username}`}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{author.username}</span>
          <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>something went wrong</div>;
  console.log(data);
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  //start fetching as soon as possible
  api.posts.getAll.useQuery();
  //return empty div if user isn't loaded
  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton mode="modal">
                  <button className="btn">Sign in</button>
                </SignInButton>
              </div>
            )}
            {isSignedIn && (
              <div className="flex w-full justify-between">
                <CreatPostWizard />
                <SignOutButton />
              </div>
            )}
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
