import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";

import Navigation from "@/components/app/Navigation";

export default function EditProfile() {
  const [user, setUser] = useState({ name: "", description: "" });

  const { data: session } = useSession();

  useEffect(() => {
    session &&
      axios
        .get("/api/users", { params: { _id: session?.user?._id } })
        .then((response) => setUser(response.data))
        .catch((error) => {
          console.log(error);
        });
  }, [session]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/api/users", user)
      .then(() =>
        UIkit.notification({
          message: "Saved!",
          status: "success",
        })
      )
      .catch((error) => {
        console.log(error);
        UIkit.notification({
          message: "Try something else",
          status: "danger",
        });
      });
  };

  return (
    <>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-small"}>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className={"uk-margin"}>
              <label>Name</label>
              <input
                type={"text"}
                value={user?.name}
                className={"uk-input"}
                onChange={(event) =>
                  setUser({ ...user, name: event.currentTarget.value })
                }
              />
            </div>
            <div className={"uk-margin"}>
              <label>Description</label>
              <textarea
                className={"uk-textarea"}
                value={user?.description}
                onChange={(event) =>
                  setUser({ ...user, description: event.currentTarget.value })
                }
              />
            </div>
            <input
              type={"submit"}
              value={"Publish"}
              className={"uk-button uk-button-primary"}
            />
          </form>
        </div>
      </div>
    </>
  );
}
