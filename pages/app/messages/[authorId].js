import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import UIkit from "uikit";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import { useGlobal } from "@/lib/context";
let relativeTime = require("dayjs/plugin/relativeTime");

import Navigation from "@/components/app/Navigation";
import Authentication from "@/components/app/Authentication";

export default function ShowMessages() {
  const [user, setUser] = useState({});
  const [body, setBody] = useState("");
  const [maxHeight, setMaxHeight] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const navbarHeight = 80;
  const avatarRef = useRef();
  const endOfMesages = useRef();
  const inputRef = useRef();
  const router = useRouter();
  const { authorId } = router.query;
  const { data: session } = useSession();
  const { messages, setMessages, isLoading } = useGlobal();

  useEffect(() => {
    axios?.patch("/api/messages", { authorId: authorId });
  });

  useEffect(() => {
    authorId &&
      axios
        .get("/api/users", { params: { userId: authorId } })
        .then((response) => setUser(response.data));
  }, [authorId]);

  useEffect(() => {
    setFilteredMessages(
      messages?.filter(
        (message) =>
          message?.authorId === authorId || message?.recipientId === authorId
      )
    );
  }, [messages]);

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
  }, [filteredMessages, user, avatarRef.current, inputRef.current]);

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
      .post("/api/messages", { recipientId: authorId, body: body })
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
    <>
      <Head>
        <title>{user?.name} | Bessa</title>
      </Head>
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
            {!isLoading ? (
              <>
                {filteredMessages?.map((message) => (
                  <div key={message?._id}>
                    <div
                      className={
                        message?.authorId === authorId
                          ? "uk-flex uk-flex-left"
                          : "uk-flex uk-flex-right"
                      }
                    >
                      <div
                        className={
                          message?.authorId === authorId
                            ? "uk-section-muted uk-padding-small uk-padding-remove-vertical"
                            : "uk-section-primary uk-padding-small uk-padding-remove-vertical"
                        }
                        style={{
                          maxWidth: "75%",
                          borderTopRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderBottomRightRadius:
                            message?.authorId === authorId ? 5 : 0,
                          borderBottomLeftRadius:
                            message?.authorId !== authorId ? 5 : 0,
                        }}
                      >
                        {message?.body}
                      </div>
                    </div>
                    {message?.authorId === authorId ? (
                      <div className={"uk-text-muted uk-flex uk-flex-left"}>
                        {dayjs(message?.createdAt).fromNow()}{" "}
                      </div>
                    ) : (
                      <div className={"uk-text-muted uk-flex uk-flex-right"}>
                        {dayjs(message?.createdAt).fromNow()}{" "}
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
            <div className={"uk-width-1-1 uk-inline"}>
              <input
                type={"text"}
                value={body}
                className={"uk-input"}
                style={{ paddingRight: "50px" }}
                onChange={(event) => setBody(event.currentTarget.value)}
                required
              />
              <button
                type={"submit"}
                value={"Send"}
                className={
                  "uk-button uk-button-link uk-position-center-right uk-flex uk-flex-middle uk-margin-right uk-height-1-1"
                }
                disabled={isSending}
              >
                <span className={"material-symbols-sharp"}>send</span>
              </button>
            </div>
          </form>
        </div>
      </Authentication>
    </>
  );
}
