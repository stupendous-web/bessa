import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import Link from "next/link";
import PostMedia from "@/components/app/PostMedia";

export default function ShowPost() {
  const [post, setPost] = useState({});

  const router = useRouter();
  const { postId } = router.query;

  useEffect(() => {
    postId &&
      axios
        .get("/api/posts", {
          params: {
            postId: postId,
          },
        })
        .then((response) => setPost(response.data[0]))
        .catch((error) => console.log(error));
  }, [postId]);

  dayjs.extend(relativeTime);

  return (
    <>
      <Head>
        <title>{user?.name} | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
            <div className={"uk-flex-middle"} data-uk-grid={""}>
              <div className={"uk-width-auto"}>
                <Link href={`/app/members/${post?.user?.[0]?._id}`}>
                  <div
                    className={"uk-cover-container uk-border-circle"}
                    style={{ height: 40, width: 40 }}
                  >
                    <img
                      src={`https://cdn.bessssssa.com/avatars/${post?.userId}`}
                      onError={(event) => {
                        event.currentTarget.src = "/images/avatar.jpg";
                      }}
                      data-uk-cover={""}
                    />
                  </div>
                </Link>
              </div>
              <div className={"uk-width-expand"}>
                <Link href={`/app/members/${post?.user?.[0]?._id}`}>
                  {post?.user?.[0]?.name}
                </Link>{" "}
                &middot; {dayjs(post?.createdAt).fromNow()}
              </div>
            </div>
            {post?.type && (
              <PostMedia nSFW={post?.nSFW} type={post?.type} id={post?._id} />
            )}
            <div className={"uk-margin"}>{post?.body}</div>
          </div>
        </div>
      </Authentication>
    </>
  );
}
