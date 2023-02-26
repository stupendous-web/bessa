import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Navigation from "../components/Navigation";
import Footer from "@/components/Footer";

import profiles from "../images/profiles.png";
import chat from "../images/chat.png";
import members from "../images/members.png";

export default function Home() {
  const sections = [
    {
      body: "Meet people from other parts of the world by listing your room or staying with other gays.",
    },
    {
      body: "Share your next event with others in your area.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          FREE gay online dating, chat, social, and listings community | Bessa |
          Welcome to the gay supper club
        </title>
        <meta property={"og:url"} content={"https://bessssssa.com"} />
        <meta
          property={"og:title"}
          content={
            "FREE gay online dating, chat, social, and listings community | Bessa | Welcome to the gay supper club"
          }
        />
        <meta
          property={"og:image"}
          content={"https://bessssssa.com/images/social.jpg"}
        />
        <meta property={"og:type"} content={"website"} />
      </Head>
      <Navigation />
      <div
        className={"uk-section uk-section-xlarge uk-background-cover"}
        style={{ backgroundImage: "url('/images/splash.jpg')" }}
      >
        <div className={"uk-container uk-container-xsmall"}>
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
        </div>
      </div>
      <div className={"uk-section"}>
        <div className={"uk-container uk-container-xsmall"}>
          <div
            className={"uk-child-width-1-2@s uk-flex-middle"}
            data-uk-grid={""}
          >
            <div>
              <Image src={profiles} />
            </div>
            <div>
              <p>
                Upload a few selfies, share a little about yourself, and post
                content to your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={"uk-section uk-section-primary"}>
        <div className={"uk-container uk-container-xsmall"}>
          <div
            className={"uk-child-width-1-2@s uk-flex-middle"}
            data-uk-grid={""}
          >
            <div>
              <p>
                Make friends by sending unlimited messages with read receipts to
                other members.
              </p>
            </div>
            <div>
              <Image src={chat} />
            </div>
          </div>
        </div>
      </div>
      <div className={"uk-section"}>
        <div className={"uk-container uk-container-xsmall"}>
          <div
            className={"uk-child-width-1-2@s uk-flex-middle"}
            data-uk-grid={""}
          >
            <div>
              <Image src={members} />
            </div>
            <div>
              <p>
                Expand your network by browsing and following other member
                profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={"uk-section uk-section-primary"}>
        <div className={"uk-container uk-container-xsmall"}>
          <div className={"uk-child-width-1-2@s"} data-uk-grid={""}>
            {sections.map((section, key) => (
              <div key={key}>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
