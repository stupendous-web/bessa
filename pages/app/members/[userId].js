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

  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    axios
      .get("/api/users", { params: { _id: userId } })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
                {user?.lastActiveAt && (
                  <div className={"uk-text-small uk-text-muted"}>
                    Active {dayjs(user?.lastActiveAt).fromNow()}
                  </div>
                )}
              </div>
            </div>
            <div className={"uk-margin"}>{user?.description}</div>
          </div>
        </div>
      </Authentication>
    </>
  );
}
