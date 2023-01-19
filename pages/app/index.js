import Authentication from "@/components/app/Authentication";
import Navigation from "@/components/app/Navigation";

export default function App() {
  return (
    <Authentication>
      <Navigation />
      <div className={"uk-section"}>
        <div className={"uk-container uk-container-expand"}>
          <h1>You&apos;re in</h1>
        </div>
      </div>
    </Authentication>
  );
}
