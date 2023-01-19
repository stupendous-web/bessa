import { useSession } from "next-auth/react";

import Link from "next/link";
export default function Authentication({ children }) {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        children
      ) : (
        <div
          className={"uk-section uk-flex uk-flex-center uk-flex-middle"}
          data-uk-height-viewport={""}
        >
          <div className={"uk-container uk-container-expand"}>
            Please <Link href={"/login"}>log in</Link>.
          </div>
        </div>
      )}
    </>
  );
}
