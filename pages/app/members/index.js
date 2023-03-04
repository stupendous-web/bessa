import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { formatDistance } from "@/utils/helpers";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import Head from "next/head";

export default function Members() {
  const [users, setUsers] = useState([]);
  const [coords, setCoords] = useState({
    latitude: undefined,
    longitude: undefined,
  });
  const [sort, setSort] = useState("distance");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        error.code === 1 && setSort("online");
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/users", {
        params:
          coords?.latitude && coords?.longitude
            ? {
                sort: sort,
                latitude: coords.latitude,
                longitude: coords.longitude,
              }
            : { sort: sort },
      })
      .then((response) => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [coords, sort]);

  dayjs.extend(relativeTime);

  return (
    <>
      <Head>
        <title>Members | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container"}>
            <div className={"uk-margin"}>
              <button
                type={"button"}
                className={"uk-button uk-button-default uk-margin-right"}
                onClick={() => setSort("distance")}
                disabled={!coords?.latitude || !coords?.longitude}
              >
                Distance
              </button>
              <a
                className={"uk-button uk-button-default uk-margin-right"}
                onClick={() => setSort("online")}
              >
                Online
              </a>
              <a
                className={"uk-button uk-button-default"}
                onClick={() => setSort("new")}
              >
                New
              </a>
            </div>
            {!isLoading ? (
              <div
                className={
                  "uk-child-width-1-2 uk-child-width-1-6@s uk-grid-small uk-grid-match"
                }
                data-uk-grid={""}
              >
                {users?.map((user) => (
                  <div key={user._id}>
                    <Link href={`/app/members/${user._id}`}>
                      <div className={"uk-card uk-card-default uk-card-small"}>
                        <div className={"uk-card-media-top"}>
                          <div
                            className={"uk-cover-container"}
                            style={{ height: 172 }}
                          >
                            <img
                              src={`https://cdn.bessssssa.com/avatars/${user?._id}`}
                              alt={user?._id}
                              onError={(event) => {
                                event.currentTarget.src = "/images/avatar.jpg";
                              }}
                              data-uk-cover={""}
                            />
                          </div>
                        </div>
                        <div className={"uk-card-body"}>
                          <div className={"uk-text-bold"}>{user?.name}</div>
                          {(user?.distance || user?.distance === 0) && (
                            <div className={"uk-text-small uk-text-muted"}>
                              {formatDistance(user.distance)}
                            </div>
                          )}
                          <div className={"uk-text-small uk-text-muted"}>
                            {dayjs(user?.lastActiveAt).fromNow()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
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
