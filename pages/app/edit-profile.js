import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function EditProfile() {
  const [user, setUser] = useState({ name: "", description: "" });
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUpload = (event) => {
    event.preventDefault();
    setIsUploading(true);
    axios
      .patch("/api/photos")
      .then(() => setIsUploading(false))
      .catch((error) => {
        UIkit.notification({
          message: "Try something else",
          status: "danger",
        });
        setIsUploading(false);
      });
  };

  return (
    <>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-small"}>
            <form onSubmit={(event) => handleSubmit(event)}>
              <div className={"uk-flex-middle"} data-uk-grid={""}>
                <div className={"uk-width-auto"}>
                  <div>
                    {isUploading ? (
                      <div
                        className={"uk-flex uk-flex-center uk-flex-middle"}
                        style={{ height: "160px", width: "160px" }}
                      >
                        <div data-uk-spinner={""} />
                      </div>
                    ) : (
                      <div className={"uk-inline"}>
                        <img
                          className={"uk-border-circle"}
                          src={"https://getuikit.com/docs/images/avatar.jpg"}
                          width={"160"}
                        />
                        <i
                          className={
                            "ri-add-circle-fill uk-position-bottom-right uk-text-large"
                          }
                          style={{ lineHeight: 1 }}
                        />
                        <input
                          type={"file"}
                          accept={"image/jpeg"}
                          className={"uk-position-center"}
                          style={{
                            height: "160px",
                            width: "160px",
                            opacity: 0,
                          }}
                          onChange={(event) => handleUpload(event)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={"uk-width-expand"}>
                  <input
                    type={"text"}
                    value={user?.name}
                    className={"uk-input"}
                    onChange={(event) =>
                      setUser({ ...user, name: event.currentTarget.value })
                    }
                    required
                  />
                </div>
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
      </Authentication>
    </>
  );
}
