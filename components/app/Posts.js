import Link from "next/link";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import PostMedia from "@/components/app/PostMedia";
import CommentButton from "@/components/app/CommentButton";
import LikeButton from "@/components/app/LikeButton";
import UIkit from "uikit";
import axios from "axios";

export default function Posts({ posts, setPosts }) {
  const { data: session } = useSession();

  const handleDelete = (postId) => {
    UIkit.modal.confirm("Are you sure?!").then(function () {
      axios
        .delete("/api/posts", { params: { postId: postId } })
        .then(() => setPosts(posts?.filter((post) => post?._id !== postId)))
        .catch((error) => console.log(error));
    });
  };

  return (
    <>
      {posts?.map((post) => (
        <div className={"uk-margin"} key={post._id}>
          <div className={"uk-flex-middle uk-grid-small"} data-uk-grid={""}>
            <div className={"uk-width-auto"}>
              <Link href={`/app/members/${post?.user?._id}`}>
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
              <Link href={`/app/members/${post?.user?._id}`}>
                {post?.user?.name}
              </Link>{" "}
              &middot; {dayjs(post?.createdAt).fromNow()}
            </div>
            <div className={"uk-width-auto"}>
              <a className={"uk-flex"}>
                <span className={"material-symbols-sharp"}>more_horiz</span>
              </a>
              <div data-uk-dropdown={"mode: click; pos: bottom-right"}>
                <ul className={"uk-nav uk-dropdown-nav"}>
                  {post?.userId === session?.user?._id && (
                    <li>
                      <a onClick={() => handleDelete(post?._id)}>Delete</a>
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
            <PostMedia isNSFW={post?.isNSFW} type={post?.type} id={post?._id} />
          )}
          <div
            className={
              post?.type
                ? "uk-flex uk-flex-middle"
                : "uk-flex uk-flex-middle uk-margin-top"
            }
          >
            <CommentButton postId={post?._id} userId={post?.user?._id} />
            <LikeButton
              postId={post?._id}
              userId={post?.user?._id}
              likes={post?.likes}
            />
          </div>
          <div>{post?.body}</div>
          {post?.comments?.map((comment) => (
            <div key={comment?._id}>
              <Link href={`/app/members/${comment?.user?._id}`}>
                {comment?.user?.name}
              </Link>{" "}
              {comment?.body}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
