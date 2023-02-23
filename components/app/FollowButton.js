import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FollowButton({ userId, followers = [] }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    session &&
      followers &&
      setIsFollowing(!!followers?.includes(session?.user?._id));
  }, [session, followers]);

  const follow = () => {
    setIsLoading(true);
    axios
      .patch("/api/users", {
        userId: userId,
        followers: [...followers, session?.user?._id],
      })
      .then(() => {
        setIsFollowing(true);
        setIsLoading(false);
      });
  };

  const unfollow = () => {
    setIsLoading(true);
    axios
      .patch("/api/users", {
        userId: userId,
        followers: followers?.filter(
          (follower) => follower !== session?.user?._id
        ),
      })
      .then(() => {
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
