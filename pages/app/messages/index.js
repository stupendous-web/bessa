import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Index() {
  const [messages, setMessage] = useState();
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }

  useEffect(() => {
    axios.get("/api/messages").then((response) => {
      setMessage(response.data);
      console.log(
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
          {messages?.map((message) => (
            <div key={message?._id}>{message?.body}</div>
          ))}
        </div>
      </div>
    </Authentication>
  );
}
