import { SA2_URL } from "@/app/constants/layers";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Point from "@arcgis/core/geometry/Point";
import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "..";

export default async function handleLocationClick(
  setValue: UseFormSetValue<FormValues>,
  handleRegionChange: (
    value: string,
    level: "state" | "sa4" | "sa3" | "sa2",
    { shouldAddLayer }: { shouldAddLayer?: boolean }
  ) => Promise<void>
) {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;

    // Check if the coordinates are within Australia's bounding box
    // Rough bounding box: lat -44 to -10, lon 112 to 154
    if (
      latitude < -44 || // South of Australia
      latitude > -10 || // North of Australia
      longitude < 112 || // West of Australia
      longitude > 154 // East of Australia
    ) {
      alert(
        "Your location is outside Australia. Please select a location within Australia."
      );
      return;
    }

    const newFeatureLayer = new FeatureLayer({
      url: SA2_URL,
      outFields: ["*"],
      opacity: 0.8,
    });

    const point = new Point({
      x: longitude, // ArcGIS expects x = lon
      y: latitude, // y = lat
      spatialReference: { wkid: 4326 }, // WGS84
    });

    const query = newFeatureLayer.createQuery();
    query.geometry = point;
    query.spatialRelationship = "intersects";
    query.returnGeometry = true;

    const result = await newFeatureLayer.queryFeatures(query);

    if (result.features.length > 0) {
      const feature = result.features[0].attributes;

      // Define the hierarchy of regions to set
      const regionsToSet = [
        { level: "state", code: feature.state_code_2021, addLayer: false },
        { level: "sa4", code: feature.sa4_code_2021, addLayer: false },
        { level: "sa3", code: feature.sa3_code_2021, addLayer: false },
        { level: "sa2", code: feature.sa2_code_2021, addLayer: true },
      ] as const;

      // Process each region in sequence
      for (const { level, code, addLayer } of regionsToSet) {
        await handleRegionChange(code, level, { shouldAddLayer: addLayer });
        setValue(level, code);

        // Wait for options to load before proceeding to next level
        if (level !== "sa2") {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } else {
      console.log("No feature found");
    }

    // // For now, just show the coordinates
    // alert(`Location found! Lat: ${latitude}, Long: ${longitude}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    alert(
      `Error getting location: ${errorMessage}. Please try again or select manually.`
    );
  }
}
