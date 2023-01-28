import Image from "next/image";
import { useEffect, useState } from "react";

export default function StupendousImage({
  path,
  fallback,
  className,
  height,
  width,
  alt = "Bessa Image",
}) {
  const [src, setSrc] = useState();

  useEffect(() => {
    setSrc(path);
  }, [path]);

  return (
    <>
      <div
        className={`uk-cover-container ${className}`}
        style={{ height: height, width: width }}
      >
        <Image
          src={src || fallback || ""}
          fill
          style={{ objectFit: "cover" }}
          onError={() => {
            setSrc(fallback);
          }}
          alt={alt}
        />
      </div>
    </>
  );
}
