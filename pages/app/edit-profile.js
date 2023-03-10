import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";
import UIkit from "uikit";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

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
          setName(response.data.name);
          setDescription(response.data.description);
        })
        .catch((error) => console.log(error));
  }, [session]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/api/users", {
        userId: session?.user?._id,
        name: name,
        description: description,
      })
      .then(() =>
        UIkit.notification({
          message: "Saved!",
          status: "success",
        })
      )
      .catch((error) => {
        console.log(error);
        UIkit.notification({
          message: "Try something else.",
          status: "danger",
        });
      });
  };

  const handleUpload = (file) => {
    event.preventDefault();
    setIsUploading(true);
    let formData = new FormData();
    formData.append("file", file);
    axios
      .post("/api/avatars", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        UIkit.notification({
          message: "Saved!",
          status: "success",
        });
        setIsUploading(false);
      })
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
      <Head>
        <title>Edit your Profile | Bessa</title>
      </Head>
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
                        <div
                          className={"uk-cover-container uk-border-circle"}
                          style={{ height: 160, width: 160 }}
                        >
                          <img
                            src={`https://cdn.bessssssa.com/avatars/${session?.user?._id}`}
                            alt={session?.user?._id}
                            onError={(event) => {
                              event.currentTarget.src = "/images/avatar.jpg";
                            }}
                            data-uk-cover={""}
                          />
                        </div>
                        <i
                          className={
                            "ri-add-circle-fill uk-position-bottom-right uk-text-large uk-link"
                          }
                          style={{ lineHeight: 1 }}
                        />
                        <input
                          type={"file"}
                          accept={"image/jpeg, image/png"}
                          className={"uk-position-center"}
                          style={{
                            height: "160px",
                            width: "160px",
                            opacity: 0,
                          }}
                          onChange={(event) =>
                            handleUpload(event.currentTarget.files[0])
                          }
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
