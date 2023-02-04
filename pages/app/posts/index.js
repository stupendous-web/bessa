import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import PostMedia from "@/components/app/PostMedia";
import LikeButton from "@/components/app/LikeButton";

export default function Index() {
  const [posts, setPosts] = useState();

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, []);

  dayjs.extend(relativeTime);

  return (
    <>
      <Head>
        <title>Posts | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
            {!!posts?.length ? (
              <>
                {posts?.map((post) => (
                  <div className={"uk-margin"} key={post._id}>
                    <div className={"uk-flex-middle"} data-uk-grid={""}>
                      <div className={"uk-width-auto"}>
                        <Link href={`/app/members/${post?.user[0]?._id}`}>
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
                        <Link href={`/app/members/${post?.user[0]?._id}`}>
                          {post?.user[0]?.name}
                        </Link>{" "}
                        &middot; {dayjs(post?.createdAt).fromNow()}
                      </div>
                    </div>
                    {post?.type && (
                      <PostMedia
                        nSFW={post?.nSFW}
                        type={post?.type}
                        id={post?._id}
                      />
                    )}
                    <LikeButton postId={post?._id} likes={post?.likes} />
                    <div className={"uk-margin"}>{post?.body}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p className={"uk-text-center"}>
                  <div data-uk-spinner={""} />
                </p>
              </>
            )}
          </div>
        </div>
      </Authentication>
    </>
  );
}
