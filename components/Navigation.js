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
          <a href={"/auth/login"} className={"uk-button uk-button-small"}>
            Login
          </a>
          <a
            href={"/auth/register"}
            className={"uk-button uk-button-primary uk-button-small"}
          >
            Join FREE!
          </a>
        </div>
      </div>
    </nav>
  );
}
