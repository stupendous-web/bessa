import { useState } from "react";

import Navigation from "@/components/Navigation";
import axios from "axios";
import { useRouter } from "next/router";

export default function ResetPassword({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSend = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios
      .post("/api/reset-password", { email: email })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/api/reset-password", {
        email: router?.query?.email,
        token: router?.query?.token,
        password: password,
      })
      .then(() => router.push("/login"));
  };

  return (
    <div>
      <Navigation />
      <div className={"uk-section"}>
        <div className={"uk-container uk-container-xsmall"}>
          <>
            {!router?.query?.email && !router?.query?.token && (
              <>
                {!isLoading ? (
                  <form onSubmit={(event) => handleSend(event)}>
                    <div className={"uk-margin"}>
                      <label>
                        Enter your email below to reset your password.
                      </label>
                      <input
                        type={"email"}
                        value={email}
                        className={"uk-input"}
                        onChange={(event) =>
                          setEmail(event.currentTarget.value)
                        }
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
              </>
            )}
          </>
          <>
            {router?.query?.email && router?.query?.token && (
              <form onSubmit={(event) => handleSubmit(event)}>
                <div className={"uk-margin"}>
                  <label>Enter your new password.</label>
                  <input
                    type={"password"}
                    value={password}
                    className={"uk-input"}
                    minLength={8}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    required
                  />
                </div>
                <input
                  type={"submit"}
                  value={"Reset"}
                  className={"uk-button uk-button-primary"}
                />
              </form>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
