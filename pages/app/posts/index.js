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
        setQuery("");
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleSort = (criteria) => {
    setIsLoading(true);
    let params;
    if (criteria === "likes") {
      params = { params: { likes: true } };
    }
    if (criteria === "discover") {
      params = { params: { discover: true } };
    }
    axios
      .get("/api/posts", params)
      .then((response) => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
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
              onClick={() => handleSort("likes")}
            >
              <div>Hot</div>
            </a>
            <a
              className={"uk-button uk-button-default uk-margin-right"}
              onClick={() => handleSort("recent")}
            >
              <div>Recent</div>
            </a>
            <a
              className={"uk-button uk-button-default"}
              onClick={() => handleSort("discover")}
            >
              <div>Discover</div>
            </a>
            {!isLoading ? (
              <>
                {!!posts?.length ? (
                  <Posts posts={posts} setPosts={setPosts} />
                ) : (
                  <div className={"uk-text-center uk-margin"}>
                    <p className={"uk-text-bold"}>Nothing turned up!</p>
                    <div>
                      Search or use the Discover tab to find people to follow.
                    </div>
                    <div>Or publish your own posts to see them here...</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={"uk-text-center uk-margin"}>
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
