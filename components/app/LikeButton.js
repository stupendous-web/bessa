import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function LikeButton({ postId, likes }) {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    likes?.find((like) => like?.userId === session?.user?._id) &&
      setIsActive(true);
    setCount(likes?.length);
  }, [session, likes]);

  const handleLike = (postId) => {
    if (!isLoading) {
      setIsLoading(true);
      if (!isActive) {
        setIsActive(true);
        setCount(count + 1);
        axios
          .post("/api/likes", {
            postId: postId,
          })
          .then(() => setIsLoading(false));
      } else {
        setIsActive(false);
        setCount(count - 1);
        axios
          .delete("/api/likes", {
            params: {
              likeId: likes?.find((like) => like?.userId === session?.user?._id)
                ?._id,
            },
          })
          .then(() => setIsLoading(false));
      }
    }
  };

  return (
    <div className={"uk-flex uk-flex-middle uk-margin"}>
      <a
        className={"uk-margin-right"}
        style={{ fontSize: "1.5rem", lineHeight: 1 }}
        onClick={() => handleLike(postId)}
      >
        <i className={isActive ? "ri-heart-fill" : "ri-heart-line"} />
      </a>
      {count} like{count !== 1 && "s"}
    </div>
  );
}
