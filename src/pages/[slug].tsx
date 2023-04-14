import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ userId }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    userId: userId,
  });
  if (isLoading) return <LoadingPage />;
  if (!data) return <div>Not found</div>;
  console.log("🚀 ~ file: [slug].tsx:12 ~ data:", data);
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>{data.username}</div>
      </main>
    </>
  );
};
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";

export const getStaticProps: GetStaticProps<{ userId: string }> = async (
  context
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("no slug");
  await ssg.profile.getUserByUsername.prefetch({ userId: slug });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId: slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
