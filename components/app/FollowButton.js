import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FollowButton({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    session &&
      axios
        .get("/api/users", { params: { userId: session?.user?._id } })
        .then((response) => {
          setIsFollowing(!!response.data?.accounts?.includes(userId));
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
  }, [session]);

  const follow = () => {
    setIsLoading(true);
    axios
      .patch("/api/follow", {
        userId: userId,
      })
      .then(() => {
        setIsFollowing(true);
        setIsLoading(false);
      });
  };

  const unfollow = () => {
    setIsLoading(true);
    axios.delete("/api/follow", { params: { userId: userId } }).then(() => {
      setIsFollowing(false);
      setIsLoading(false);
    });
  };

  return (
    <button
      className={"uk-button uk-button-primary uk-margin-right"}
      onClick={() => (isFollowing ? unfollow() : follow())}
      disabled={isLoading}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
