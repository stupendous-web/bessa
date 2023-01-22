import Link from "next/link";

import Navigation from "@/components/app/Navigation";

export default function Members() {
  return (
    <>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xlarge"}>
          <div
            className={"uk-child-width-1-2 uk-child-width-1-6@s uk-grid-match"}
            data-uk-grid={""}
          >
            <div>
              <Link href={"https://google.com"}>
                <div className={"uk-card uk-card-default uk-card-small"}>
                  <div class={"uk-card-media-top"}>
                    <img src={"https://getuikit.com/docs/images/avatar.jpg"} />
                  </div>
                  <div class={"uk-card-body"}>
                    <div class={"uk-text-bold"}>Topher</div>
                    <div className={"uk-text-small uk-text-muted"}>
                      3 mi. away
                    </div>
                    <div className={"uk-text-small uk-text-muted"}>
                      Online 5 minutes ago
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
