import { useState } from "react";

import Navigation from "@/components/Navigation";
import axios from "axios";

export default function ResetPassword({}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios
      .post("/api/reset-password", { email: email })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Navigation />
      <div className={"uk-section"}>
        <div className={"uk-container uk-container-xsmall"}>
          {!isLoading ? (
            <form onSubmit={(event) => handleSubmit(event)}>
              <div className={"uk-margin"}>
                <label>Enter your email below to reset your password.</label>
                <input
                  type={"email"}
                  value={email}
                  className={"uk-input"}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  required
                />
              </div>
              <input
                type={"submit"}
                value={"Go!"}
                className={"uk-button uk-button-primary"}
              />
            </form>
          ) : (
            <div>Now, follow the link in your inbox.</div>
          )}
        </div>
      </div>
    </div>
  );
}
