import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostMedia({ nSFW, type, id }) {
  const [filter, setFilter] = useState(true);

  useEffect(() => {
    setFilter(nSFW);
  }, [nSFW]);

  return (
    <>
      {type.includes("image") && (
        <div className={"uk-margin"}>
          <div className={"uk-width-1-1 uk-inline uk-cover-container"}>
            <Link href={`/app/posts/${id}`}>
              <img
                src={`https://cdn.bessssssa.com/posts/${id}`}
                className={"uk-width-1-1"}
                style={{
                  filter: filter ? "blur(75px)" : "blur()",
                }}
              />
            </Link>
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
