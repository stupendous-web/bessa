import { signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav
      className={"uk-navbar-container"}
      data-uk-navbar={""}
      data-uk-sticky={""}
    >
      <div className={"uk-navbar-left"}>
        <a href={"/app"} className={"uk-navbar-item uk-logo"}>
          Bessa
        </a>
        <div className={"uk-navbar-item"}>Welcome, {session?.user?.name}</div>
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
