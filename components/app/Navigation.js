import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";
import Pusher from "pusher-js";
import { useGlobal } from "@/lib/context";

export default function Navigation() {
  const [body, setBody] = useState("");
  const [file, setFile] = useState({});
  const [nSFW, setNSFW] = useState(false);
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
    !authorId &&
      setNewNotifications(
        notifications?.filter(
          (notification) =>
            notification?.recipientId === session?.user?._id &&
            !notification?.isRead
        )
      );
  }, [authorId, notifications]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "us3",
    });
    const channel = pusher.subscribe(session?.user?._id);
    channel.bind(
      "new-message",
      (data) =>
        data.message.authorId !== authorId &&
        setMessages([...messages, data.message])
    );

    return () => pusher.unsubscribe(session?.user?._id);
  }, [authorId, messages]);

  const handlePublish = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("body", body);
    formData.append("file", file);
    formData.append("nSFW", nSFW);
    axios
      .post("/api/posts", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        UIkit.modal("#publish-modal").hide();
        setBody("");
        setFile({});
        setNSFW(false);
        UIkit.notification({
          message: "Published!",
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        UIkit.notification({
          message: "Try something else.",
          status: "danger",
        });
      });
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
            <a href={"#side-navigation"} data-uk-toggle={""}>
              <i
                className={"ri-menu-fill uk-flex"}
                style={{ fontSize: "1.5rem" }}
              />
            </a>
          </div>
        </div>
        <div className={"uk-navbar-right"}>
          <div className={"uk-navbar-item"}>
            <div className={"uk-navbar-item"}>
              <a href={"#publish-modal"} data-uk-toggle={""}>
                <i
                  className={"ri-edit-2-fill uk-flex"}
                  style={{ fontSize: "1.5rem" }}
                />
              </a>
            </div>
            <div className={"uk-navbar-item"}>
              <Link href={"/app/notifications"}>
                <div className={"uk-inline"}>
                  <i
                    className={"ri-notification-2-fill uk-flex"}
                    style={{
                      fontSize: "1.5rem",
                      paddingRight: !!newNotifications?.length && "0 10px",
                      lineHeight: 1.5,
                    }}
                  />
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
            <div className={"uk-navbar-item"}>
              <Link href={"/app/messages"}>
                <div className={"uk-inline"}>
                  <i
                    className={"ri-mail-fill uk-flex"}
                    style={{
                      fontSize: "1.5rem",
                      paddingRight: !!newMessages?.length && "0 10px",
                      lineHeight: 1.5,
                    }}
                  />
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
            <div className={"uk-navbar-item"}>
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
      <div id={"publish-modal"} data-uk-modal={""}>
        <div className={"uk-modal-dialog uk-modal-body"}>
          <form onSubmit={(event) => handlePublish(event)}>
            <div className={"uk-margin"}>
              <textarea
                className={"uk-textarea"}
                value={body}
                onChange={(event) => setBody(event.currentTarget.value)}
                required
              />
            </div>
            <div className={"uk-flex-middle"} data-uk-grid={""}>
              <div className={"uk-width-expand"}>
                <label>
                  <input
                    type={"checkbox"}
                    checked={nSFW}
                    className={"uk-checkbox uk-margin-right"}
                    onChange={() => setNSFW(!nSFW)}
                  />
                  This is NSFW
                </label>
              </div>
              <div>
                <div className={"uk-inline"}>
                  <i
                    className={"ri-image-fill uk-text-large uk-link"}
                    style={{ lineHeight: 1, display: "flex" }}
                  />
                  <input
                    type={"file"}
                    accept={"image/jpeg, image/png"}
                    className={"uk-position-center"}
                    style={{
                      height: "36px",
                      width: "36px",
                      opacity: 0,
                    }}
                    onChange={(event) => setFile(event.currentTarget.files[0])}
                  />
                </div>
              </div>
              <div>
                <input
                  type={"submit"}
                  value={"Publish"}
                  className={"uk-button uk-button-primary"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
