import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

import avatar from "../../../images/avatar.jpg";

export default function Members() {
  const [users, setUsers] = useState();

  useEffect(() => {
    axios.get("/api/users").then((response) => setUsers(response.data));
  }, []);

  dayjs.extend(relativeTime);

  return (
    <>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container"}>
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
                        <Image src={avatar} alt={"Pride Flag"} />
                      </div>
                      <div className={"uk-card-body"}>
                        <div className={"uk-text-bold"}>{user?.name}</div>
                        <div className={"uk-text-small uk-text-muted"}>
                          3 mi. away
                        </div>
                        {user?.lastActiveAt && (
                          <div className={"uk-text-small uk-text-muted"}>
                            Active {dayjs(user?.lastActiveAt).fromNow()}
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
      </Authentication>
    </>
  );
}
