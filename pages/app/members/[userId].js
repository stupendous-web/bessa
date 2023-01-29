import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import { formatDistance } from "@/utils/helpers";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function ShowProfile() {
  const [user, setUser] = useState({});
  const [coords, setCoords] = useState({
    latitude: undefined,
    longitude: undefined,
  });

  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    userId &&
      coords?.latitude &&
      coords?.longitude &&
      axios
        .get("/api/users", {
          params: {
            userId: userId,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        })
        .then((response) => setUser(response.data[0]))
        .catch((error) => console.log(error));
  }, [userId, coords]);

  dayjs.extend(relativeTime);

  return (
    <>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-small"}>
            <div className={"uk-flex-middle"} data-uk-grid={""}>
              <div className={"uk-width-auto"}>
                <div>
                  <div
                    className={"uk-cover-container uk-border-circle"}
                    style={{ height: 160, width: 160 }}
                  >
                    <img
                      src={`https://cdn.bessssssa.com/avatars/${user?._id}`}
                      alt={user?._id}
                      data-uk-cover={""}
                    />
                  </div>
                </div>
              </div>
              <div className={"uk-width-expand"}>
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
            <div className={"uk-margin"}>{user?.description}</div>
          </div>
        </div>
      </Authentication>
    </>
  );
}
