import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function LikeButton({ postId, likes }) {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    likes?.find((like) => like?.userId === session?.user?._id) &&
      setIsActive(true);
    setCount(likes?.length);
  }, [session, likes]);

  const handleLike = (postId) => {
    if (!isActive) {
      setIsActive(true);
      setCount(count + 1);
      axios.post("/api/likes", {
        postId: postId,
      });
    } else {
      setIsActive(false);
      setCount(count - 1);
      axios.delete("/api/likes", {
        params: {
          likeId: likes?.find((like) => like?.userId === session?.user?._id)
            ?._id,
        },
      });
    }
  };

  return (
    <div className={"uk-flex uk-flex-middle uk-margin"}>
      <i
        className={
          isActive
            ? "ri-heart-fill uk-margin-right"
            : "ri-heart-line uk-margin-right"
        }
        style={{ fontSize: "1.5rem", lineHeight: 1 }}
        onClick={() => handleLike(postId)}
      />
      {count} like{count !== 1 && "s"}
    </div>
  );
}
