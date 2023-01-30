import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Index() {
  const [messages, setMessages] = useState();

  useEffect(() => {
    axios.get("/api/messages").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xsmall"}>
          <p>Inbox</p>
          {messages?.map((message) => (
            <div
              className={"uk-flex-middle uk-grid-small"}
              key={message?._id}
              data-uk-grid={""}
            >
              <div className={"uk-width-auto"}>*</div>
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
              <div>
                <Link href={`/app/messages/${message?.author}`}>
                  <div className={"uk-text-bold"}>
                    {message?.authorMeta?.[0]?.name}
                  </div>
                  <div>{messages?.[0]?.body?.slice(0, 50)}</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Authentication>
  );
}