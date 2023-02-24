import { useState } from "react";
import axios from "axios";
import UIkit from "uikit";

export default function CommentButton({ postId, userId }) {
  const [comment, setComment] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios
      .post("/api/comments", {
        postId: postId,
        comment: comment,
        userId: userId,
      })
      .then(() => {
        setComment("");
        UIkit.modal(`#comment-modal-${postId}`).hide();
        UIkit.notification({
          message: "Sent!",
          status: "success",
        });
        setIsLoading(false);
      })
      .catch(() => {
        UIkit.notification({
          message: "Oops! Something went wrong",
          status: "danger",
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <a
        className={"uk-margin-right"}
        style={{ fontSize: "1.5rem", lineHeight: 1 }}
        data-uk-toggle={"#modal"}
      >
        <i className={"ri-chat-1-line"} />
      </a>
      <div id={`comment-modal-${postId}`} data-uk-modal={""}>
        <div className={"uk-modal-dialog uk-modal-body"}>
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className={"uk-margin"}>
              <textarea
                className={"uk-textarea"}
                value={comment}
                onChange={(event) => setComment(event.currentTarget.value)}
                required
              />
            </div>
            <div>
              <input
                type={"submit"}
                value={!isLoading ? "Send!" : "Sending..."}
                className={"uk-button uk-button-primary"}
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
