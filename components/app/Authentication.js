import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import axios from "axios";

export default function Authentication({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        axios.patch("/api/users", {
          location: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

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
