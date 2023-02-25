import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useGlobal } from "@/lib/context";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Notifications() {
  const { notifications } = useGlobal();

  useEffect(() => {
    axios.patch("/api/notifications");
  }, []);

  dayjs.extend(relativeTime);

  return (
    <>
      <Head>
        <title>Notifications | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
            <p className={"uk-text-bold"}>Notifications</p>
            {notifications?.map((notification) => (
              <div key={notification?._id} className={"uk-margin"}>
                <div>
                  <Link
                    href={`/app/members/${notification?.authorMeta?.[0]?._id}`}
                  >
                    <div
                      className={"uk-cover-container uk-border-circle"}
                      style={{ height: 40, width: 40 }}
                    >
                      <img
                        src={`https://cdn.bessssssa.com/avatars/${notification?.authorId}`}
                        onError={(event) => {
                          event.currentTarget.src = "/images/avatar.jpg";
                        }}
                        data-uk-cover={""}
                      />
                    </div>
                  </Link>
                </div>
                {notification?.type === "like" && (
                  <>
                    <div>
                      <Link
                        href={`/app/members/${notification?.authorMeta?.[0]?._id}`}
                      >
                        {notification?.authorMeta?.[0]?.name}
                      </Link>{" "}
                      liked one of your posts
                    </div>
                    <div>{dayjs(notification?.createdAt).fromNow()}</div>
                  </>
                )}
                {notification?.type === "comment" && (
                  <>
                    <div>
                      <Link
                        href={`/app/members/${notification?.authorMeta?.[0]?._id}`}
                      >
                        {notification?.authorMeta?.[0]?.name}
                      </Link>{" "}
                      commented on one of your posts.
                    </div>
                    <div>{notification?.preview}</div>
                    <div>{dayjs(notification?.createdAt).fromNow()}</div>
                  </>
                )}
                {notification?.type === "follow" && (
                  <>
                    <div>
                      <Link
                        href={`/app/members/${notification?.authorMeta?.[0]?._id}`}
                      >
                        {notification?.authorMeta?.[0]?.name}
                      </Link>{" "}
                      followed you.
                    </div>
                    <div>{notification?.preview}</div>
                    <div>{dayjs(notification?.createdAt).fromNow()}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Authentication>
    </>
  );
}
