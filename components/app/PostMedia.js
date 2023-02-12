import { useEffect, useState } from "react";

export default function PostMedia({ nSFW, type, id }) {
  const [filter, setFilter] = useState(true);

  useEffect(() => {
    setFilter(nSFW);
  }, [nSFW]);

  return (
    <>
      {type.includes("image") ? (
        <div className={"uk-margin"}>
          <div className={"uk-width-1-1 uk-inline uk-cover-container"}>
            <img
              src={`https://cdn.bessssssa.com/posts/${id}`}
              className={"uk-width-1-1"}
              style={{
                filter: filter ? "blur(75px)" : "blur()",
              }}
            />
            {filter && (
              <>
                <div className="uk-overlay-default uk-position-cover" />
                <div className="uk-overlay uk-position-center uk-text-center">
                  <p>This content is NSFW</p>
                  <a
                    className={"uk-button uk-button-default"}
                    onClick={() => setFilter(false)}
                  >
                    Reveal
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={"uk-margin"}>
          <div className={"uk-width-1-1 uk-inline uk-cover-container"}>
            <video
              src={`https://cdn.bessssssa.com/posts/${id}`}
              width={"1800"}
              height={"1200"}
              loop
              muted
              playsInline
              data-uk-video={"autoplay: inview"}
              style={{
                filter: filter ? "blur(75px)" : "blur()",
              }}
            />
            {filter && (
              <>
                <div className="uk-overlay-default uk-position-cover" />
                <div className="uk-overlay uk-position-center uk-text-center">
                  <p>This content is NSFW</p>
                  <a
                    className={"uk-button uk-button-default"}
                    onClick={() => setFilter(false)}
                  >
                    Reveal
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
