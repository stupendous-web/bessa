import { useEffect, useState } from "react";
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
          <div className={"uk-container"}>
            {posts?.map((post) => (
              <div key={post._id}>
                <p>{post?.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Authentication>
    </>
  );
}
