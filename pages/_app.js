import { useEffect } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import UIkit from "uikit";

import { Provider } from "@/lib/context";

import "../styles/uikit/uikit.css";
import "remixicon/fonts/remixicon.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    UIkit.container = ".uk-scope";
  });

  console.log(
    "%c ███  █████ █   █ ████  ████ █   █ ███   ███  █   █  ███  █     █ ████ ████\n" +
      "█       █   █   █ █   █ █    ██  █ █  █ █   █ █   █ █     █     █ █    █   █\n" +
      " ███    █   █   █ ████  ███  █ █ █ █  █ █   █ █   █  ███  █  █  █ ███  ████\n" +
      "    █   █   █   █ █     █    █  ██ █  █ █   █ █   █     █  █ █ █  █    █   █\n" +
      "████    █    ███  █     ████ █   █ ███   ███   ███  ████    █ █   ████ ████ .COM\n",
    "color: #d02670"
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <div className={"uk-scope"}>
        <SessionProvider session={session}>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      </div>
    </>
  );
}
