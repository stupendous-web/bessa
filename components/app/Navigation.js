import { signOut } from "next-auth/react";

export default function Navigation() {
  return (
    <nav
      className={"uk-navbar-container"}
      data-uk-navbar={""}
      data-uk-sticky={""}
    >
      <div className={"uk-navbar-left"}>
        <a href={"/"} className={"uk-navbar-item uk-logo"}>
          Bessa
        </a>
      </div>
      <div className={"uk-navbar-right"}>
        <div className={"uk-navbar-item"}>
          <a
            className={"uk-button uk-button-small"}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
