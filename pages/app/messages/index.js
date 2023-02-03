import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useGlobal } from "@/lib/context";
import { useSession } from "next-auth/react";
import { groupBy } from "@/utils/helpers";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Index() {
  const [groupedMessages, setGroupedMessages] = useState([]);
  const { messages, isLoading } = useGlobal();
  const { data: session } = useSession();

  useEffect(() => {
    setGroupedMessages(
      Object.keys(groupBy(messages, "author"))
        .map((key) => {
          return messages
            ?.filter((message) => message?.author === key)
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        })
        .filter((message) => message?.author !== session?.user?._id)
    );
  }, [messages]);

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
                {groupedMessages?.map((message) => (
                  <Link
                    key={message?.author}
                    href={`/app/messages/${message?.author}`}
                  >
                    <div
                      className={"uk-flex-middle uk-grid-small uk-margin"}
                      data-uk-grid={""}
                    >
                      <div style={{ width: "5px" }}>
                        {!message?.isRead && (
                          <span className={"uk-text-bold"}>&middot;</span>
                        )}
                      </div>
                      <div className={"uk-width-auto"}>
                        <div
                          className={"uk-cover-container uk-border-circle"}
                          style={{ height: 40, width: 40 }}
                        >
                          <img
                            src={`https://cdn.bessssssa.com/avatars/${message?.author}`}
                            onError={(event) => {
                              event.currentTarget.src = "/images/avatar.jpg";
                            }}
                            data-uk-cover={""}
                          />
                        </div>
                      </div>
                      <div className={"uk-width-expand"}>
                        <div className={"uk-text-bold"}>
                          {message?.authorMeta?.[0]?.name}
                        </div>
                        <div>{message?.body?.slice(0, 90)}</div>
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
