import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { formatDistance } from "@/utils/helpers";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Members() {
  const [users, setUsers] = useState();
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [coords, setCoords] = useState({
    latitude: undefined,
    longitude: undefined,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        error.code === 1 && setIsPermissionDenied(true);
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    coords?.latitude &&
      coords?.longitude &&
      axios
        .get("/api/users", {
          params: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.log(error));
  }, [coords]);

  dayjs.extend(relativeTime);

  return (
    <>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container"}>
            {!isPermissionDenied ? (
              <div
                className={
                  "uk-child-width-1-2 uk-child-width-1-6@s uk-grid-match"
                }
                data-uk-grid={""}
              >
                {users?.map((user) => (
                  <div key={user._id}>
                    <Link href={`/app/members/${user._id}`}>
                      <div className={"uk-card uk-card-default uk-card-small"}>
                        <div className={"uk-card-media-top"}>
                          <img
                            src={`https://cdn.bessssssa.com/avatars/${user._id}`}
                            alt={user?.name}
                            onError={(event) => {
                              event.currentTarget.src = "/images/avatar.jpg";
                              event.onerror = null;
                            }}
                          />
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
              <div className={"uk-section uk-section-xlarge"}>
                <div
                  className={"uk-container uk-container-expand uk-text-center"}
                >
                  Oops! This section doesn&apos;t work unless you share your
                  location.
                </div>
              </div>
            )}
          </div>
        </div>
      </Authentication>
    </>
  );
}
