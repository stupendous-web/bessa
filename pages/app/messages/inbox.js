import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function Inbox() {
  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section uk-section-xsmall"}>
        <div className={"uk-container uk-container-xsmall"}>
          <p>Inbox</p>
        </div>
      </div>
    </Authentication>
  );
}
