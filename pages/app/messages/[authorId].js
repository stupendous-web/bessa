import Authentication from "@/components/app/Authentication";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
let relativeTime = require("dayjs/plugin/relativeTime");
import UIkit from "uikit";

import Navigation from "@/components/app/Navigation";

export default function ShowMessages() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [body, setBody] = useState("");
  const [maxHeight, setMaxHeight] = useState(0);
  const navbarHeight = 80;
  const avatarRef = useRef();
  const endOfMesages = useRef();
  const inputRef = useRef();
  const router = useRouter();
  const { authorId } = router.query;

  useEffect(() => {
    authorId &&
      axios
        .get("/api/messages", { params: { authorId: authorId } })
        .then((response) => setMessages(response.data));
  }, [authorId]);

  useEffect(() => {
    authorId &&
      axios
        .get("/api/users", { params: { userId: authorId } })
        .then((response) => setUser(response.data));
  }, [authorId]);

  useEffect(() => {
    setMaxHeight(
      window.innerHeight -
        navbarHeight -
        avatarRef.current?.clientHeight -
        inputRef.current?.clientHeight
    );
  }, [user, avatarRef.current, inputRef.current]);

  useEffect(() => {
    endOfMesages.current?.scrollIntoView();
  }, [messages, avatarRef.current, inputRef.current]);

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
      <div className={"uk-text-center uk-padding-small"} ref={avatarRef}>
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
        <div>{user?.name}</div>
      </div>
      <div
        className={"uk-overflow-auto"}
        style={{
          height: "100vh",
          maxHeight: maxHeight,
        }}
      >
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
        <div ref={endOfMesages} />
      </div>
      <div className={"uk-section-primary uk-padding-small"} ref={inputRef}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className={"uk-grid-small"} data-uk-grid={""}>
            <div className={"uk-width-expand"}>
              <input
                type={"text"}
                value={body}
                className={"uk-input"}
                onChange={(event) => setBody(event.currentTarget.value)}
                required
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
