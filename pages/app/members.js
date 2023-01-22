import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Navigation from "@/components/app/Navigation";

export default function Members() {
  const [users, setUsers] = useState();

  axios.get("/api/users").then((response) => setUsers(response.data));

  dayjs.extend(relativeTime);

  return (
    <>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xlarge"}>
          <div
            className={"uk-child-width-1-2 uk-child-width-1-6@s uk-grid-match"}
            data-uk-grid={""}
          >
            {users?.map((user) => (
              <div key={user._id}>
                <Link href={"https://google.com"}>
                  <div className={"uk-card uk-card-default uk-card-small"}>
                    <div className={"uk-card-media-top"}>
                      <img
                        src={"https://getuikit.com/docs/images/avatar.jpg"}
                      />
                    </div>
                    <div className={"uk-card-body"}>
                      <div className={"uk-text-bold"}>{user?.name}</div>
                      <div className={"uk-text-small uk-text-muted"}>
                        3 mi. away
                      </div>
                      {user?.lastLogin && (
                        <div className={"uk-text-small uk-text-muted"}>
                          Online {dayjs(user?.lastLogin).fromNow()}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
