import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email: email, password: password });
    signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })
      .then((response) => {
        console.log(response);
        if (!response?.error) {
          router.push("/app/posts");
        } else {
          setError(
            response?.status === 401
              ? "Hmm. Your email and/or password may be wrong."
              : "Hmm. Something went wrong."
          );
          setEmail("");
          setPassword("");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Head>
        <title>
          Login | Bessa | FREE gay online dating, chat, social, and listings
          community
        </title>
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
              <Link href={"/"} legacyBehavior>
                <a className={"uk-logo"}>Bessa</a>
              </Link>
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
                <Link href={"/register"}>Register</Link> &middot;{" "}
                <Link href={"/reset-password"}>Reset Password</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
