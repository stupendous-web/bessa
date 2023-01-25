import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import axios from "axios";

export default function Authentication({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // axios.patch("/api/update-activity", {
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    session && axios.patch("/api/update-activity");
  }, [session]);

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
