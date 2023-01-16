import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/app",
    });
  };

  return (
    <>
      <Head>
        <title>Login | Bessa | Welcome to the gay supper club</title>
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
              <h1 className={"uk-margin-remove-top"}>Login</h1>
              <form onSubmit={handleSubmit}>
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
                <input
                  type={"submit"}
                  value={"Let's Go!"}
                  className={"uk-button uk-button-primary uk-margin-right"}
                />
                <Link href={"/register"}>Register</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
