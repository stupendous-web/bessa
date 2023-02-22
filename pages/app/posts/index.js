import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import Posts from "@/components/app/Posts";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
            {!isLoading ? (
              <>
                {!!posts?.length ? (
                  <Posts posts={posts} setPosts={setPosts} />
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
