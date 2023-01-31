import Authentication from "@/components/app/Authentication";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");
import UIkit from "uikit";

import Navigation from "@/components/app/Navigation";

export default function ShowMessages() {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const router = useRouter();
  const { authorId } = router.query;

  useEffect(() => {
    authorId &&
      axios
        .get("/api/messages", { params: { authorId: authorId } })
        .then((response) => setMessages(response.data));
  }, [authorId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/api/messages", { recipient: authorId, body: body })
      .then((response) => {
        setBody("");
        setMessages([...messages, response.data]);
      })
      .catch(() => {
        UIkit.notification({
          message: "Try something else.",
          status: "danger",
        });
      });
  };

  dayjs.extend(relativeTime);

  return (
    <Authentication>
      <Navigation />
      <div
        className={"uk-section uk-section-xsmall"}
        data-uk-height-viewport={"offset-top: true; offset-bottom: true"}
      >
        <div className={"uk-container uk-container-xsmall"}>
          <div className={"uk-text-center"}>
            <div
              className={
                "uk-cover-container uk-border-circle uk-display-inline-block"
              }
              style={{ height: 80, width: 80 }}
            >
              <img
                src={`https://cdn.bessssssa.com/avatars/${authorId}`}
                onError={(event) => {
                  event.currentTarget.src = "/images/avatar.jpg";
                }}
                data-uk-cover={""}
              />
            </div>
          </div>
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
      <div className={"uk-section-primary uk-padding-small"}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className={"uk-grid-small"} data-uk-grid={""}>
            <div className={"uk-width-expand"}>
              <input
                type={"text"}
                value={body}
                className={"uk-input"}
                onChange={(event) => setBody(event.currentTarget.value)}
              />
            </div>
            <div>
              <input
                type={"submit"}
                value={"Send"}
                className={"uk-button uk-button-primary"}
              />
            </div>
          </div>
        </form>
      </div>
    </Authentication>
  );
}
