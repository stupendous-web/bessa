import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import UIkit from "uikit";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import PostMedia from "@/components/app/PostMedia";
import LikeButton from "@/components/app/LikeButton";
import CommentButton from "@/components/app/CommentButton";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoadnig, setIsLoading] = useState(true);
  const { data: session } = useSession([]);

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((response) => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios
      .get("/api/posts", { params: { searchQuery: query } })
      .then((response) => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (postId) => {
    UIkit.modal.confirm("Are you sure?!").then(function () {
      axios
        .delete("/api/posts", { params: { postId: postId } })
        .then(() => setPosts(posts?.filter((post) => post?._id !== postId)))
        .catch((error) => console.log(error));
    });
  };

  const handleSort = (criteria) => {
    criteria === "hot" &&
      setPosts([...posts.sort((a, b) => b.likes.length - a.likes.length)]);
    criteria === "recent" &&
      setPosts([
        ...posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      ]);
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
            <form onSubmit={() => handleSearch(event)}>
              <div className={"uk-width-1-1 uk-inline"}>
                <div
                  className={
                    "uk-position-center-left uk-flex uk-flex-middle uk-margin-left uk-height-1-1"
                  }
                >
                  <span className={"material-symbols-sharp"}>search</span>
                </div>
                <input
                  type={"text"}
                  value={query}
                  className={"uk-input"}
                  style={{ paddingLeft: 50 }}
                  placeholder={"Search"}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
              </div>
              <div className={"uk-margin"}></div>
            </form>
            <a
              className={"uk-button uk-button-default uk-margin-right"}
              onClick={() => handleSort("hot")}
            >
              <div className={"uk-flex"}>
                <i className={"ri-fire-fill"} />
                &nbsp;Hot
              </div>
            </a>
            <a
              className={"uk-button uk-button-default"}
              onClick={() => handleSort("recent")}
            >
              <div className={"uk-flex"}>
                <i className={"ri-time-fill"} />
                &nbsp;Recent
              </div>
            </a>
            {!isLoadnig ? (
              <>
                {!!posts?.length ? (
                  <>
                    {posts?.map((post) => (
                      <div className={"uk-margin"} key={post._id}>
                        <div
                          className={"uk-flex-middle uk-grid-small"}
                          data-uk-grid={""}
                        >
                          <div className={"uk-width-auto"}>
                            <Link href={`/app/members/${post?.user[0]?._id}`}>
                              <div
                                className={
                                  "uk-cover-container uk-border-circle"
                                }
                                style={{ height: 40, width: 40 }}
                              >
                                <img
                                  src={`https://cdn.bessssssa.com/avatars/${post?.userId}`}
                                  onError={(event) => {
                                    event.currentTarget.src =
                                      "/images/avatar.jpg";
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
                              data-uk-dropdown={
                                "mode: click; pos: bottom-right"
                              }
                            >
                              <ul className={"uk-nav uk-dropdown-nav"}>
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
                        <div
                          className={
                            post?.type
                              ? "uk-flex uk-flex-middle"
                              : "uk-flex uk-flex-middle uk-margin-top"
                          }
                        >
                          <CommentButton
                            postId={post?._id}
                            userId={post?.user[0]?._id}
                          />
                          <LikeButton
                            postId={post?._id}
                            userId={post?.user[0]?._id}
                            likes={post?.likes}
                          />
                        </div>
                        <div>{post?.body}</div>
                        {post?.comments?.map((comment) => (
                          <div key={comment?._id}>
                            <Link
                              href={`/app/members/${comment?.users[0]?._id}`}
                            >
                              {comment?.users[0]?.name}
                            </Link>{" "}
                            {comment?.body}
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={"uk-text-center uk-margin"}>
                    <p className={"uk-text-bold"}>Nothing turned up!</p>
                    <p>
                      Try something else. Or... maybe it&apos;s time to publish
                      something...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={"uk-text-center"}>
                  <div data-uk-spinner={""} />
                </div>
              </>
            )}
          </div>
        </div>
      </Authentication>
    </>
  );
}
