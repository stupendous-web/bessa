import Link from "next/link";

export default function Footer() {
  const links = [
    { href: "privacy", content: "Privacy" },
    { href: "terms", content: "Terms" },
  ];

  return (
    <div className={"uk-section uk-section-xsmall"}>
      <div className={"uk-container uk-container-expand"}>
        <div className={"uk-child-width-1-2"} data-uk-grid={""}>
          <div className={"uk-width-expand"}>
            &copy; 2023{" "}
            <Link href={"https://stupendousweb.com"} legacyBehavior>
              <a
                title={
                  "Web App Development Services | Stupendous Web | If you want to build community, build a stupendous web app"
                }
              >
                Stupendous Web
              </a>
            </Link>
          </div>
          <div className={"uk-width-auto"}>
            <ul className={"uk-subnav"}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} legacyBehavior>
                    <a
                      title={`${link.content} | Stupendous Web | If you want to build community, build a stupendous web app`}
                    >
                      {link.content}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
