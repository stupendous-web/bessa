import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/api/users", {
        name: name,
        email: email,
        password: password,
      })
      .then(() => {
        signIn("credentials", {
          email: email,
          password: password,
          callbackUrl: "/app",
        });
      })
      .catch((error) => {
        console.log(error);
        setError(error?.response?.data?.title || "There was an error.");
      });
  };

  return (
    <>
      <Head>
        <title>Join for FREE! | Bessa | Welcome to the gay supper club</title>
      </Head>
      <div className={"uk-grid-collapse uk-flex-middle"} data-uk-grid={""}>
        <div
          className={"uk-width-2-3@s uk-background-cover uk-visible@s"}
          style={{ backgroundImage: "url('/images/splash.jpg')" }}
          data-uk-height-viewport={""}
        />
        <div className={"uk-width-1-3@s"}>
          <div className={"uk-section"}>
            <div className={"uk-container"}>
              <p className={"uk-text-bold uk-margin-remove"}>Bessa</p>
              <h1 className={"uk-margin-remove-top"}>Join for FREE!</h1>
              <form onSubmit={handleSubmit}>
                <div className={"uk-margin"}>
                  <label className={"uk-form-label"}>Name</label>
                  <input
                    type={"text"}
                    value={name}
                    className={"uk-input"}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className={"uk-margin"}>
                  <label className={"uk-form-label"}>Email</label>
                  <input
                    type={"email"}
                    value={email}
                    className={"uk-input"}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className={"uk-margin"}>
                  <label className={"uk-form-label"}>Password</label>
                  <input
                    type={"password"}
                    value={password}
                    className={"uk-input"}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <div className={"uk-margin"}>
                  <label className={"uk-form-label"}>
                    <input
                      type={"checkbox"}
                      className={"uk-checkbox"}
                      required
                    />{" "}
                    I am at least 18 years or older.
                  </label>
                </div>
                <div className={"uk-margin"}>
                  <label className={"uk-form-label"}>
                    <input
                      type={"checkbox"}
                      className={"uk-checkbox"}
                      required
                    />{" "}
                    I agree to play nice!
                  </label>
                </div>
                {error && (
                  <div className={"uk-alert-danger"} data-uk-alert={""}>
                    <p>
                      {error} Please try again or email{" "}
                      <Link
                        href={"mailto:topher@stupendousweb.com"}
                        legacyBehavior
                      >
                        <a>topher@stupendousweb.com</a>
                      </Link>{" "}
                      for help.
                    </p>
                  </div>
                )}
                <input
                  type={"submit"}
                  value={"Let's Go!"}
                  className={"uk-button uk-button-primary uk-margin-right"}
                />
                <Link href={"/login"}>Login</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
