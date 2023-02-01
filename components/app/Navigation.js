import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";

export default function Navigation() {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [file, setFile] = useState({});
  const [nSFW, setNSFW] = useState(false);

  const { data: session } = useSession();

  const links = [
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

  useEffect(() => {
    session &&
      axios
        .get("/api/messages", { params: { recipientId: session?.user?._id } })
        .then((response) =>
          setMessages(response.data?.filter((message) => !message?.isRead))
        );
  }, [session]);

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
          <Link href={"/app/members"} legacyBehavior>
            <a className={"uk-navbar-item uk-logo"}>Bessa</a>
          </Link>
        </div>
        <div className={"uk-navbar-right"}>
          <div className={"uk-navbar-item"}>
            <div className={"uk-navbar-item"}>
              <a href={"#publish-modal"} data-uk-toggle={""}>
                <i className={"ri-edit-2-fill uk-text-large uk-flex"} />
              </a>
            </div>
            <div className={"uk-navbar-item"}>
              <Link href={"/app/messages"}>
                <div className={"uk-inline"}>
                  <i
                    className={"ri-mail-fill uk-text-large uk-flex"}
                    style={{ lineHeight: 1 }}
                  />
                  {!!messages?.length && (
                    <span
                      className="uk-badge uk-position-bottom-right uk-text-muted"
                      style={{ backgroundColor: "#da1e28" }}
                    >
                      {messages?.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div className={"uk-navbar-item"}>
              <a data-uk-toggle={"#account-menu"}>
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
            </div>
            <div
              id={"account-menu"}
              data-uk-offcanvas={"flip: true; mode: push"}
            >
              <div className={"uk-offcanvas-bar"}>
                <ul className={"uk-nav uk-nav-default"}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={`/app/${link.href}`} legacyBehavior>
                        <a>{link.title}</a>
                      </Link>
                    </li>
                  ))}
                  <div className={"uk-nav-divider"} />
                  <li>
                    <Link href={"/app/edit-profile"}>Profile</Link>
                  </li>
                  <li>
                    <Link href={"/app/settings"}>Settings</Link>
                  </li>
                  <li>
                    <a onClick={() => signOut({ callbackUrl: "/" })}>Logout</a>
                  </li>
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
