import Link from "next/link";

export default function Navigation() {
  return (
    <nav
      className={"uk-navbar-container"}
      data-uk-navbar={""}
      data-uk-sticky={""}
    >
      <div className={"uk-navbar-left"}>
        <Link href={"/"} legacyBehavior>
          <a className={"uk-navbar-item uk-logo"}>Bessa</a>
        </Link>
      </div>
      <div className={"uk-navbar-right"}>
        <div className={"uk-navbar-item"}>
          <a href={"/login"} className={"uk-button uk-button-small"}>
            Login
          </a>
          <a
            href={"/register"}
            className={"uk-button uk-button-primary uk-button-small"}
          >
            Join FREE!
          </a>
        </div>
      </div>
    </nav>
  );
}
