import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import UIkit from "uikit";
import { useSession } from "next-auth/react";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Settings() {
  const [settings, setSettings] = useState({});
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    session &&
      axios
        .get("/api/users", { params: { userId: session?.user?._id } })
        .then((response) => {
          setSettings(response.data.settings);
        })
        .catch((error) => console.log(error));
  }, [session]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/api/users", { settings: settings })
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

  const handleDelete = () => {
    UIkit.modal.confirm("Are you sure?!").then(function () {
      axios
        .delete("/api/users")
        .then(() => router.push("/"))
        .catch(() => router.push("/"));
    });
  };

  return (
    <>
      <Head>
        <title>Settings | Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-small"}>
            <form onSubmit={(event) => handleSubmit(event)}>
              <div className={"uk-text-bold"}>Notifications</div>
              <div className={"uk-margin"}>
                <label>Email Notifications</label>
                <select
                  value={settings?.emailNotifications}
                  className={"uk-select"}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      emailNotifications: event.currentTarget.value,
                    })
                  }
                >
                  <option value={""}>Off</option>
                  <option value={"daily"}>Daily</option>
                  <option value={"weekly"}>Weekly</option>
                </select>
              </div>
              <input
                type={"submit"}
                value={"Save"}
                className={"uk-button uk-button-primary"}
              />
            </form>
          </div>
        </div>
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-small"}>
            <div className={"uk-text-bold"}>Account</div>
            <div className={"uk-margin"}>
              <a
                className={"uk-button uk-button-default"}
                onClick={() => handleDelete()}
              >
                Delete my Account
              </a>
              <div className={"uk-text-danger uk-margin-left"}>
                This will delete all your data and content and cannot be undone.
              </div>
            </div>
          </div>
        </div>
      </Authentication>
    </>
  );
}
