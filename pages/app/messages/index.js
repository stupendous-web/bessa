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
            <div key={message?._id}>
              <Link href={`/app/messages/${message?.author}`}>
                {message?.authorMeta?.[0]?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Authentication>
  );
}
