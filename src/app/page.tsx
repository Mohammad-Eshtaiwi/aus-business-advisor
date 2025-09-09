import clsx from "clsx";
import styles from "./mainPage.module.scss";
import Aside from "./components/aside";
import { RegionsProvider } from "./context/RegionsContext";
import { RegionsData } from "./types/regions";
import { MapProvider } from "@/components/Map/Provider";
import Map from "@/components/Map";

export default async function Home() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/regions`
  );
  const regions: RegionsData = await data.json();

  return (
    <RegionsProvider regions={regions.data}>
      <MapProvider basemap="topo-vector" zoom={4}>
        <div className={clsx(styles.pageContainer)}>
          <Aside />
          <main className={clsx(styles.mapContainer)}>
            <Map />
          </main>
        </div>
      </MapProvider>
    </RegionsProvider>
  );
}
