import { useRouter } from "next/router";
import axios from "axios";
import UIkit from "uikit";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Settings() {
  const router = useRouter();

  const handleDelete = () => {
    axios
      .delete("/api/users")
      .then(() => router.push("/"))
      .catch((error) => {
        console.log(error);
        UIkit.notification({
          message: "Try something else.",
          status: "danger",
        });
      });
  };

  return (
    <>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-small"}>
            <div className={"uk-text-bold"}>Account</div>
            <a
              className={"uk-button uk-button-default"}
              onClick={() => handleDelete()}
            >
              Delete my Account
            </a>
            <div className={"uk-text-danger"}>This cannot be undone.</div>
          </div>
        </div>
      </Authentication>
    </>
  );
}
