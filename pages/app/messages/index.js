import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Index() {
  const [messages, setMessages] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/messages").then((response) => {
      setMessages(response.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Messages | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
            <p>Inbox</p>
            {!isLoading ? (
              <>
                {messages?.map((message) => (
                  <Link
                    key={message?._id?.author}
                    href={`/app/messages/${message?._id?.author}`}
                  >
                    <div
                      className={"uk-flex-middle uk-grid-small uk-margin"}
                      data-uk-grid={""}
                    >
                      <div className={"uk-width-auto"}>*</div>
                      <div className={"uk-width-auto"}>
                        <div
                          className={"uk-cover-container uk-border-circle"}
                          style={{ height: 40, width: 40 }}
                        >
                          <img
                            src={`https://cdn.bessssssa.com/avatars/${message?._id?.author}`}
                            onError={(event) => {
                              event.currentTarget.src = "/images/avatar.jpg";
                            }}
                            data-uk-cover={""}
                          />
                        </div>
                      </div>
                      <div>
                        <div className={"uk-text-bold"}>
                          {message?.authorMeta?.[0]?.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <>
                <p className={"uk-text-center"}>
                  <div data-uk-spinner={""} />
                </p>
              </>
            )}
          </div>
        </div>
      </Authentication>
    </>
  );
}
