import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

import avatar from "../../images/avatar.jpg";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    session &&
      axios
        .get("/api/users", { params: { userId: session?.user?._id } })
        .then((response) => {
          setName(response.data[0].name);
          setDescription(response.data[0].description);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [session]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/api/users", { name: name, description: description })
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
      .post("/api/avatars")
      .then(() => setIsUploading(false))
      .catch(() => {
        UIkit.notification({
          message: "Try something else.",
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
                      <div
                        className={"uk-inline"}
                        data-uk-tooltip={"No NSFW profile pictures!"}
                      >
                        <Image
                          src={avatar}
                          alt={"Pride Flag"}
                          className={"uk-border-circle"}
                          height={160}
                          width={160}
                        />
                        <i
                          className={
                            "ri-add-circle-fill uk-position-bottom-right uk-text-large uk-link"
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
                    value={name}
                    className={"uk-input"}
                    onChange={(event) => setName(event.currentTarget.value)}
                    required
                  />
                </div>
              </div>
              <div className={"uk-margin"}>
                <label>Description</label>
                <textarea
                  className={"uk-textarea"}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
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
