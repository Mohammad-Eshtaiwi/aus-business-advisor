"use client";

import { useMap } from "./Provider";
import { useEffect } from "react";

export default function Map({ id = "map" }: { id?: string }) {
  const { initMap } = useMap();
  console.log("initMap");

  useEffect(() => {
    initMap(document.getElementById(id) as HTMLDivElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div style={{ maxWidth: "100%", height: "100%" }} id={id} />;
}
