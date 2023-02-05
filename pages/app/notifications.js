import Head from "next/head";
import Link from "next/link";
import { useGlobal } from "@/lib/context";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Notifications() {
  const { notifications } = useGlobal();

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
              <div key={notification?._id}>
                <div
                  className={"uk-flex-middle uk-grid-small uk-margin"}
                  data-uk-grid={""}
                >
                  <div style={{ width: "5px" }}>
                    {!notification?.isRead && (
                      <span className={"uk-text-bold uk-text-primary"}>
                        &middot;
                      </span>
                    )}
                  </div>
                  <div className={"uk-width-auto"}>
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
                  <div className={"uk-width-expand"}>
                    <div>
                      {notification?.type === "like" && (
                        <>
                          <Link
                            href={`/app/members/${notification?.authorMeta?.[0]?._id}`}
                          >
                            {notification?.authorMeta?.[0]?.name}
                          </Link>{" "}
                          liked one of your posts
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Authentication>
    </>
  );
}
