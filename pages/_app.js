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
    "%c  ___ _                          _            __      __   _    \n" +
      " / __| |_ _  _ _ __  ___ _ _  __| |___ _  _ __\\ \\    / /__| |__ \n" +
      " \\__ \\  _| || | '_ \\/ -_) ' \\/ _` / _ \\ || (_-<\\ \\/\\/ / -_) '_ \\\n" +
      " |___/\\__|\\_,_| .__/\\___|_||_\\__,_\\___/\\_,_/__/ \\_/\\_/\\___|_.__/.COM\n" +
      "              |_| ",
    "color: #ec008c"
  );

  return (
    <>
      <Head>
        <title>Chat</title>
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
