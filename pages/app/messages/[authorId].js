import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowMessages() {
  const [messages, setMessage] = useState();

  useEffect(() => {
    axios.get("/api/messages").then((response) => setMessage(response.data));
  }, []);

  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xsmall"}>
          <p>Inbox</p>
          {messages?.map((message) => (
            <div key={message?._id}>{message?.body}</div>
          ))}
        </div>
      </div>
    </Authentication>
  );
}
