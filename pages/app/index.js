import Head from "next/head";

import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function App() {
  return (
    <>
      <Head>
        <title>Bessa</title>
      </Head>
      <Authentication>
        <Navigation />
        <div className={"uk-section uk-section-xsmall"}>
          <div className={"uk-container uk-container-xsmall"}>
            <p>You&apos;re in!</p>
          </div>
        </div>
      </Authentication>
    </>
  );
}
