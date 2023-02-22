import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useGlobal } from "@/lib/context";

import Publish from "@/components/app/Publish";

export default function Navigation() {
  const [newMessages, setNewMessages] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { authorId } = router.query;
  const { messages, setMessages, notifications } = useGlobal();

  const sideLinks = [
    {
      title: "Posts",
      href: "posts",
    },
    {
      title: "Members",
      href: "members",
    },
    // {
    //   title: "Map",
    //   href: "map",
    // },
    // {
    //   title: "Events",
    //   href: "events",
    // },
    // {
    //   title: "Services",
    //   href: "services",
    // },
    // {
    //   title: "Places",
    //   href: "places",
    // },
  ];

  const topLinks = [
    {
      title: "Profile",
      href: "edit-profile",
    },
    {
      title: "Settings",
      href: "settings",
    },
  ];

  useEffect(() => {
    !authorId &&
      setNewMessages(
        messages?.filter(
          (message) =>
            message?.recipientId === session?.user?._id && !message?.isRead
        )
      );
  }, [authorId, messages]);

  useEffect(() => {
    setNewNotifications(
      notifications?.filter(
        (notification) =>
          notification?.recipientId === session?.user?._id &&
          !notification?.isRead
      )
    );
  }, [notifications]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "us3",
    });
    const channel = pusher.subscribe(`${session?.user?._id}`);
    channel.bind("new-message", (data) => {
      if (data.message.authorId !== authorId) {
        setMessages([...messages, data.message]);
        sendNotification();
      }
    });

    return () => pusher.unsubscribe(`${session?.user?._id}`);
  }, [authorId, messages]);

  useEffect(() => {
    "Notification" in window && Notification.requestPermission();
  }, []);

  const sendNotification = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        const notification = new Notification("New Messages!");
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification("New Messages!");
          }
        });
      }
    }
  };

  return (
    <>
      <nav
        className={"uk-navbar-container"}
        data-uk-navbar={""}
        data-uk-sticky={""}
      >
        <div className={"uk-navbar-left"}>
          <div className={"uk-navbar-item"}>
            <a
              href={"#side-navigation"}
              className={"uk-flex"}
              data-uk-toggle={""}
            >
              <span className={"material-symbols-sharp"}>menu</span>
            </a>
          </div>
          <ul className={"uk-navbar-nav uk-visible@s"}>
            {sideLinks.map((link) => (
              <li key={link.href}>
                <Link href={`/app/${link.href}`} legacyBehavior>
                  <a>{link.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={"uk-navbar-right"}>
          <div className={"uk-navbar-item"}>
            <Publish />
            <div className={"uk-navbar-item"} style={{ padding: "0 5px" }}>
              <Link href={"/app/notifications"}>
                <div className={"uk-inline uk-flex"}>
                  <span
                    className={"material-symbols-sharp"}
                    style={{
                      paddingRight: newNotifications?.length && "10px",
                    }}
                  >
                    notifications
                  </span>
                  {!!newNotifications?.length && (
                    <span
                      className="uk-badge uk-position-bottom-right uk-text-muted"
                      style={{ backgroundColor: "#da1e28" }}
                    >
                      {newNotifications?.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div className={"uk-navbar-item"} style={{ padding: "0 5px" }}>
              <Link href={"/app/messages"}>
                <div className={"uk-inline uk-flex"}>
                  <span
                    className={"material-symbols-sharp"}
                    style={{
                      paddingRight: newMessages?.length && "10px",
                    }}
                  >
                    mail
                  </span>
                  {!!newMessages?.length && (
                    <span
                      className="uk-badge uk-position-bottom-right uk-text-muted"
                      style={{ backgroundColor: "#da1e28" }}
                    >
                      {newMessages?.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div
              className={"uk-navbar-item"}
              style={{ padding: "0 15px 0 5px" }}
            >
              <a>
                <div
                  className={"uk-cover-container uk-border-circle"}
                  style={{ height: 40, width: 40 }}
                >
                  <img
                    src={`https://cdn.bessssssa.com/avatars/${session?.user?._id}`}
                    alt={session?.user?._id}
                    onError={(event) => {
                      event.currentTarget.src = "/images/avatar.jpg";
                    }}
                    data-uk-cover={""}
                  />
                </div>
              </a>
              <div
                data-uk-dropdown={"pos: top-center; offset: 36; mode: click"}
              >
                <ul className={"uk-nav uk-navbar-dropdown-nav"}>
                  {topLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={`/app/${link.href}`} legacyBehavior>
                        <a>{link.title}</a>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a onClick={() => signOut({ callbackUrl: "/" })}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
            <div id={"side-navigation"} data-uk-offcanvas={""}>
              <div className={"uk-offcanvas-bar"}>
                <ul className={"uk-nav uk-nav-default"}>
                  {sideLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={`/app/${link.href}`} legacyBehavior>
                        <a>{link.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
