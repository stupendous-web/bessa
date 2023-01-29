import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Posts() {
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
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
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
                {post?.type?.includes("image") && (
                  <div className={"uk-margin"}>
                    <img src={`https://cdn.bessssssa.com/posts/${post?._id}`} />
                  </div>
                )}
                <div className={"uk-margin"}>{post?.body}</div>
              </div>
            ))}
          </div>
        </div>
      </Authentication>
    </>
  );
}
