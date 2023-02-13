import { useEffect, useState } from "react";
import axios from "axios";
import UIkit from "uikit";

export default function Publish() {
  const [body, setBody] = useState("");
  const [file, setFile] = useState({});
  const [isNSFW, setIsNSFW] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [flair, setFlair] = useState("");

  useEffect(() => {
    isNSFW && setIsPublic(false);
  }, [isNSFW, isPublic]);

  const categories = ["Listing", "Event", "Service"];

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("body", body);
    formData.append("file", file);
    formData.append("isNSFW", isNSFW);
    formData.append("isPublic", isPublic);
    formData.append("flair", flair);
    axios
      .post("/api/posts", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        UIkit.modal("#publish-modal").hide();
        setBody("");
        setFile({});
        setIsNSFW(false);
        setIsPublic(false);
        setFlair("");
        UIkit.notification({
          message: "Published!",
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status === 413) {
          UIkit.notification({
            message: "Try a smaller file.",
            status: "danger",
          });
        } else {
          UIkit.notification({
            message: "Try something else.",
            status: "danger",
          });
        }
      });
  };

  return (
    <>
      <div className={"uk-navbar-item"} style={{ padding: "0 5px" }}>
        <a
          href={"#publish-modal"}
          className={"uk-button uk-button-primary uk-button-small"}
          data-uk-toggle={""}
        >
          Publish
        </a>
      </div>
      <div id={"publish-modal"} data-uk-modal={""}>
        <div className={"uk-modal-dialog uk-modal-body"}>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className={"uk-margin"}>
              <textarea
                className={"uk-textarea"}
                value={body}
                onChange={(event) => setBody(event.currentTarget.value)}
                required
              />
            </div>
            <div className={"uk-flex-middle uk-grid-small"} data-uk-grid={""}>
              <div>
                <label className={"uk-margin-remove"}>
                  <input
                    type={"checkbox"}
                    checked={isNSFW}
                    className={"uk-checkbox uk-margin-right"}
                    onChange={() => setIsNSFW(!isNSFW)}
                  />
                  NSFW
                </label>
              </div>
              <div>
                <label className={"uk-margin-remove"}>
                  <input
                    type={"checkbox"}
                    checked={isPublic}
                    className={"uk-checkbox uk-margin-right"}
                    onChange={() => setIsPublic(!isPublic)}
                    disabled={isNSFW}
                  />
                  Public
                </label>
              </div>
              <div className={"uk-width-expand"}>
                <select
                  className={"uk-select"}
                  onChange={(event) => setFlair(event.currentTarget.value)}
                >
                  <option value={""} selected>
                    Flair
                  </option>
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className={"uk-inline uk-flex"}>
                  <div
                    className={
                      "uk-button uk-button-primary uk-icon-button uk-flex"
                    }
                  >
                    <span className={"material-symbols-sharp"}>
                      add_photo_alternate
                    </span>
                  </div>
                  <input
                    type={"file"}
                    accept={"image/jpeg, image/png, video/mp4"}
                    className={"uk-position-center"}
                    style={{
                      height: "36px",
                      width: "36px",
                      opacity: 0,
                    }}
                    onChange={(event) => setFile(event.currentTarget.files[0])}
                  />
                </div>
              </div>
              <div>
                <input
                  type={"submit"}
                  value={"Publish"}
                  className={"uk-button uk-button-primary"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}