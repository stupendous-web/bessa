import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Index() {
  const [messages, setMessages] = useState();
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }

  useEffect(() => {
    axios.get("/api/messages").then((response) => {
      console.log(
        response.data.reduce((accumulator, object) => {
          const key = object["author"];
          const curGroup = accumulator[key] ?? [];

          return { ...accumulator, [key]: [...curGroup, object] };
        }, {})
      );
      setMessages(
        response.data.reduce((accumulator, object) => {
          const key = object["author"];
          const curGroup = accumulator[key] ?? [];

          return { ...accumulator, [key]: [...curGroup, object] };
        }, {})
      );
    });
  }, []);

  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xsmall"}>
          <p>Inbox</p>
          {messages?.["63c4afbbb49780fc0506af7c"]?.map((message) => {
            console.log(message);
            return <div key={message?._id}>{message?.body}</div>;
          })}
        </div>
      </div>
    </Authentication>
  );
}
