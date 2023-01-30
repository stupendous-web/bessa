import Authentication from "@/components/app/Authentication";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");

import Navigation from "@/components/app/Navigation";

export default function ShowMessages() {
  const [messages, setMessage] = useState();
  const router = useRouter();
  const { authorId } = router.query;

  useEffect(() => {
    axios.get("/api/messages").then((response) => setMessage(response.data));
  }, []);

  dayjs.extend(relativeTime);

  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xsmall"}>
          {messages?.map((message) => (
            <div key={message?._id}>
              <div
                className={
                  message?.author === authorId
                    ? "uk-flex uk-flex-left"
                    : "uk-flex uk-flex-right"
                }
              >
                <div
                  className={
                    "uk-section-primary uk-padding-small uk-padding-remove-vertical"
                  }
                  style={{
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    borderBottomRightRadius:
                      message?.author === authorId ? 5 : 0,
                    borderBottomLeftRadius:
                      message?.author !== authorId ? 5 : 0,
                  }}
                >
                  {message?.body}
                </div>
              </div>
              <div
                className={
                  message?.author === authorId
                    ? "uk-text-muted uk-flex uk-flex-left"
                    : "uk-text-muted uk-flex uk-flex-right"
                }
              >
                {dayjs(message?.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Authentication>
  );
}
