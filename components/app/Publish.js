import { useState } from "react";
import axios from "axios";
import UIkit from "uikit";

export default function Publish() {
  const [body, setBody] = useState("");
  const [file, setFile] = useState({});
  const [nSFW, setNSFW] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("body", body);
    formData.append("file", file);
    formData.append("nSFW", nSFW);
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
        setNSFW(false);
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
            <div className={"uk-flex-middle"} data-uk-grid={""}>
              <div className={"uk-width-expand"}>
                <label>
                  <input
                    type={"checkbox"}
                    checked={nSFW}
                    className={"uk-checkbox uk-margin-right"}
                    onChange={() => setNSFW(!nSFW)}
                  />
                  This is NSFW
                </label>
              </div>
              <div>
                <div className={"uk-inline uk-flex"}>
                  <span className={"material-symbols-sharp uk-link"}>
                    add_photo_alternate
                  </span>
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
