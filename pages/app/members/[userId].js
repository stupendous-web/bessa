import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

import avatar from "../../../images/avatar.jpg";

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
          userId: userId,
          params: {
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
                  <Image
                    src={avatar}
                    alt={"Pride Flag"}
                    className={"uk-border-circle"}
                    height={160}
                    width={160}
                  />
                </div>
              </div>
              <div className={"uk-width-expand"}>
                <div className={"uk-text-bold"}>{user?.name}</div>
                {(user?.distance || user?.distance === 0) && (
                  <div className={"uk-text-small uk-text-muted"}>
                    {user.distance} mi. away
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
