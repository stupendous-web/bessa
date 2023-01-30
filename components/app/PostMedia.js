import { useEffect, useState } from "react";

export default function PostMedia({ nSFW, type, id }) {
  const [filter, setFilter] = useState(true);

  useEffect(() => {
    setFilter(nSFW);
  }, [nSFW]);

  return (
    <>
      {type.includes("image") && (
        <div className={"uk-margin"}>
          <div className={"uk-inline uk-cover-container"}>
            <img
              src={`https://cdn.bessssssa.com/posts/${id}`}
              style={{
                filter: filter ? "blur(75px)" : "blur()",
              }}
            />
            {filter && (
              <>
                <div class="uk-overlay-default uk-position-cover" />
                <div class="uk-overlay uk-position-center uk-text-center">
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
