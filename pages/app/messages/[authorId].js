import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import UIkit from "uikit";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
let relativeTime = require("dayjs/plugin/relativeTime");

import Navigation from "@/components/app/Navigation";
import Authentication from "@/components/app/Authentication";

export default function ShowMessages() {
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState({});
  const [body, setBody] = useState("");
  const [maxHeight, setMaxHeight] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const navbarHeight = 80;
  const avatarRef = useRef();
  const endOfMesages = useRef();
  const inputRef = useRef();
  const router = useRouter();
  const { authorId } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    authorId &&
      axios
        .get("/api/messages", { params: { authorId: authorId } })
        .then((response) => {
          setMessages(response.data);
          setIsFetching(false);
        });
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
  }, [messages, user, avatarRef.current, inputRef.current]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "us3",
    });
    const channel = pusher.subscribe(`${session?.user?._id}`);
    channel.bind("new-message", (data) =>
      setMessages([...messages, data.message])
    );

    return () => pusher.unsubscribe(`${session?.user?._id}`);
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSending(true);
    axios
      .post("/api/messages", { recipient: authorId, body: body })
      .then((response) => {
        setBody("");
        setMessages([...messages, response.data]);
        setIsSending(false);
      })
      .catch(() => {
        UIkit.notification({
          message: "Try something else.",
          status: "danger",
        });
        setIsSending(false);
      });
  };

  dayjs.extend(relativeTime);

  return (
    <Authentication>
      <Navigation />
      <Link href={`/app/members/${authorId}`}>
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
      </Link>
      <div
        className={"uk-overflow-auto"}
        style={{
          height: "100vh",
          maxHeight: maxHeight,
        }}
      >
        <div className={"uk-container uk-container-xsmall"}>
          {!isFetching ? (
            <>
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
                        message?.author === authorId
                          ? "uk-section-muted uk-padding-small uk-padding-remove-vertical"
                          : "uk-section-primary uk-padding-small uk-padding-remove-vertical"
                      }
                      style={{
                        maxWidth: "75%",
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
                  {message?.author === authorId ? (
                    <div className={"uk-text-muted uk-flex uk-flex-left"}>
                      {dayjs(message?.createdAt).fromNow()}
                    </div>
                  ) : (
                    <div className={"uk-text-muted uk-flex uk-flex-right"}>
                      {dayjs(message?.createdAt).fromNow()}
                      {message?.isRead && <span>&nbsp;&middot; Read</span>}
                    </div>
                  )}
                </div>
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
                disabled={isSending}
              />
            </div>
          </div>
        </form>
      </div>
    </Authentication>
  );
}
