import Head from "next/head";
import Link from "next/link";

import Navigation from "../components/Navigation";

export default function Home() {
  const sections = [
    {
      heading: "Profiles",
      body: "Be seen by uploading a few selfies and a little about yourself to your Bessa profile.",
      icon: "ri-user-fill",
    },
    {
      heading: "DM",
      body: "Make friends by sending private messages to other members.",
      icon: "ri-chat-1-fill",
    },
    {
      heading: "Social",
      body: "Get the convo going by posting pictures and videos to your social feed.",
      icon: "ri-image-fill",
    },
    {
      heading: "Services",
      body: "Share your work and support the work of others in the community.",
      icon: "ri-service-fill",
    },
    {
      heading: "Travel",
      body: "Meet people from other parts of the world by listing your room or staying with other gays.",
      icon: "ri-road-map-fill",
    },
    {
      heading: "Events",
      body: "Share your next event with others in your area.",
      icon: "ri-calendar-event-fill",
    },
  ];

  return (
    <>
      <Head>
        <title>
          Bessa | FREE gay online dating, chat, social, and listings community |
          Welcome to the gay supper club
        </title>
      </Head>
      <Navigation />
      <div
        className={"uk-section uk-section-xlarge uk-background-cover"}
        style={{ backgroundImage: "url('/images/splash.jpg')" }}
      >
        <div className={"uk-container"}>
          <div
            className={"uk-child-width-1-2@s uk-grid-match"}
            data-uk-grid={""}
          >
            <div className={"uk-flex-middle"}>
              <h1>Welcome to the gay supper club.</h1>
              <p className={"uk-text-large"}>
                FREE gay online dating, chat, social, and listings community.
              </p>
              <p>
                <Link href={"/register"} legacyBehavior>
                  <a
                    className={
                      "uk-button uk-button-secondary uk-button-large uk-margin-right"
                    }
                  >
                    Join for FREE 😈
                  </a>
                </Link>
                <Link href={"/login"} legacyBehavior>
                  <a className={"uk-text-muted uk-text-uppercase"}>Login</a>
                </Link>
              </p>
            </div>
            <div className={"uk-flex-bottom uk-visible@s"}>
              <img
                src={"../images/mockup.png"}
                alt={"Bessa"}
                style={{ marginBottom: "-11rem" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={"uk-section uk-section-large"}>
        <div className={"uk-container uk-container-xsmall"}>
          <div className={"uk-child-width-1-3@s"} data-uk-grid={""}>
            {sections.map((section) => (
              <div key={section.heading}>
                <h3 className={"uk-flex"}>
                  <i className={`${section.icon} uk-margin-right`} />
                  {section.heading}
                </h3>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
