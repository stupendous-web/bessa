import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import PostMedia from "@/components/app/PostMedia";
import LikeButton from "@/components/app/LikeButton";

export default function Index() {
  const [posts, setPosts] = useState();
  const { data: session } = useSession();

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleDelete = (postId) => {
    axios
      .delete("/api/posts", { params: { postId: postId } })
      .then(() => setPosts(posts?.filter((post) => post?._id !== postId)))
      .catch((error) => console.log(error));
  };

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
                      <div className={"uk-width-auto"}>
                        <a className={"uk-flex"}>
                          <span className={"material-symbols-sharp"}>
                            more_horiz
                          </span>
                        </a>
                        <div
                          data-uk-dropdown={"mode: click; pos: bottom-right"}
                        >
                          <ul class={"uk-nav uk-dropdown-nav"}>
                            {post?.userId === session?.user?._id && (
                              <li>
                                <a onClick={() => handleDelete(post?._id)}>
                                  Delete
                                </a>
                              </li>
                            )}
                            <li>
                              <a>Report</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {post?.type && (
                      <PostMedia
                        isNSFW={post?.isNSFW}
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
