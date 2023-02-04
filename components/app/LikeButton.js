import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function LikeButton({ postId, likes = [] }) {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    likes?.includes(session?.user?._id) && setIsActive(true);
    setCount(likes?.length || 0);
  }, [session, likes]);

  const handleLike = (postId) => {
    if (!isActive) {
      setIsActive(true);
      setCount(count + 1);
      axios.patch("/api/posts", {
        postId: postId,
        likes: [...likes, session?.user?._id],
      });
    } else {
      setIsActive(false);
      setCount(count - 1);
      axios.patch("/api/posts", {
        postId: postId,
        likes: likes?.filter((like) => like !== session?.user?._id),
      });
    }
  };

  return (
    <div className={"uk-flex uk-flex-middle"}>
      <i
        className={
          isActive
            ? "ri-heart-fill uk-margin-right"
            : "ri-heart-line uk-margin-right"
        }
        style={{ fontSize: "1.5rem", lineHeight: 1 }}
        onClick={() => handleLike(postId)}
      />
      {count} likes
    </div>
  );
}
