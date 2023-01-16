import { SessionProvider } from "next-auth/react";
import uikit from "uikit";

import "../styles/uikit/uikit.css";
import "remixicon/fonts/remixicon.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  console.log(
    "%c  ___ _                          _            __      __   _    \n" +
      " / __| |_ _  _ _ __  ___ _ _  __| |___ _  _ __\\ \\    / /__| |__ \n" +
      " \\__ \\  _| || | '_ \\/ -_) ' \\/ _` / _ \\ || (_-<\\ \\/\\/ / -_) '_ \\\n" +
      " |___/\\__|\\_,_| .__/\\___|_||_\\__,_\\___/\\_,_/__/ \\_/\\_/\\___|_.__/.COM\n" +
      "              |_| ",
    "color: #ec008c"
  );

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
