import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  const links = [
    // {
    //   title: "Feed",
    //   href: "feed",
    // },
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

  const handlePublish = (event) => {
    event.preventDefault();
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
            <a className={"uk-navbar-item uk-logo uk-visible@s"}>Bessa</a>
          </Link>
          <div className={"uk-navbar-item"}>Welcome, {session?.user?.name}</div>
        </div>
        <div className={"uk-navbar-right"}>
          <div className={"uk-navbar-item"}>
            <div className={"uk-navbar-item"}>
              <a href={"#publish-modal"} data-uk-toggle={""}>
                <i className={"ri-edit-2-fill"} />
              </a>
            </div>
            <div className={"uk-navbar-item"}>
              <Link href={"/app/inbox"}>
                <i className={"ri-mail-fill"} />
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
          Publish
          <form onSubmit={(event) => handlePublish(event)}>
            <div className={"uk-margin"}>
              <textarea className={"uk-textarea"}></textarea>
            </div>
            <div className={"uk-text-right"}>
              <input
                type={"submit"}
                value={"Publish"}
                className={"uk-button uk-button-primary"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
