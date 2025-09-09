"use client";

import { createContext, useContext, useRef, ReactNode, useState } from "react";
// We'll dynamically import ArcGIS modules
// Declare module variables
let Map: typeof import("@arcgis/core/Map").default;
let MapView: typeof import("@arcgis/core/views/MapView").default;
let FeatureLayer: typeof import("@arcgis/core/layers/FeatureLayer").default;
let MapImageLayer: typeof import("@arcgis/core/layers/MapImageLayer").default;

// Initialize ArcGIS modules only in browser environment
if (typeof window !== "undefined") {
  // Using Promise.all to load all modules in parallel
  Promise.all([
    import("@arcgis/core/Map"),
    import("@arcgis/core/views/MapView"),
    import("@arcgis/core/layers/FeatureLayer"),
    import("@arcgis/core/layers/MapImageLayer"),
  ]).then(
    ([mapModule, mapViewModule, featureLayerModule, mapImageLayerModule]) => {
      Map = mapModule.default;
      MapView = mapViewModule.default;
      FeatureLayer = featureLayerModule.default;
      MapImageLayer = mapImageLayerModule.default;
    }
  );
}

interface LayerConfig {
  type: "feature" | "map-image";
  url: string;
  options?: __esri.FeatureLayerProperties | __esri.MapImageLayerProperties;
}

interface MapContextValue {
  map: __esri.Map | null;
  view: __esri.MapView | null;
  initMap: (container: HTMLDivElement) => Promise<void>;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export const useMap = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be inside MapProvider");
  return ctx;
};

interface MapProviderProps {
  children?: ReactNode;
  basemap?: string;
  center?: [number, number];
  zoom?: number;
  layers?: LayerConfig[];
}

export function MapProvider({
  children,
  basemap = "streets-vector",
  center = [151.2093, -33.8688],
  zoom = 10,
  layers = [],
}: MapProviderProps) {
  const mapRef = useRef<__esri.Map | null>(null);
  const viewRef = useRef<__esri.MapView | null>(null);
  const layersRef = useRef<LayerConfig[]>(layers);

  const initMap = async (container: HTMLDivElement) => {
    if (viewRef.current) return; // initialize only once

    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Wait for modules to be loaded
    if (!Map || !MapView || !FeatureLayer || !MapImageLayer) {
      console.log("Waiting for ArcGIS modules to load...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return initMap(container);
    }

    const map = new Map({ basemap });
    mapRef.current = map;

    // Add initial layers
    layersRef.current.forEach((layer) => {
      let instance;
      if (layer.type === "feature") {
        instance = new FeatureLayer({ url: layer.url, ...layer.options });
      } else {
        instance = new MapImageLayer({ url: layer.url, ...layer.options });
      }
      if (instance) map.add(instance);
    });

    // Create and store the view
    const view = new MapView({
      container,
      map,
      center,
      zoom,
    });
    viewRef.current = view;

    // Force a re-render to update the context value
    setMapState({ map, view, initMap });
  };

  const [mapState, setMapState] = useState<MapContextValue>({
    map: null,
    view: null,
    initMap,
  });

  return <MapContext.Provider value={mapState}>{children}</MapContext.Provider>;
}

function addLayer(
  layer: __esri.Layer,
  map: __esri.Map,
  { removeAll = false } = {}
) {
  if (!map) throw new Error("Map not initialized");
  if (removeAll) removeAllLayers(map);
  map.add(layer);
}

function removeLayer(layer: __esri.Layer, map: __esri.Map) {
  if (!map) throw new Error("Map not initialized");
  map.remove(layer);
}

function removeAllLayers(map: __esri.Map) {
  if (!map) throw new Error("Map not initialized");
  map.removeAll();
}

interface AddFeatureLayerConfig {
  url: string;
  codeField: string;
  code: string;
}

async function addFeatureLayer(
  config: AddFeatureLayerConfig,
  map: __esri.Map,
  view: __esri.MapView
) {
  if (!map) throw new Error("Map not initialized");
  if (!view) throw new Error("View not initialized");

  const newFeaturesLayer = new FeatureLayer({
    url: config.url,
    definitionExpression: `${config.codeField} = '${config.code}'`,
    opacity: 0.8,
    outFields: ["*"],
  });

  try {
    // Add the layer to the map, removing any existing layers
    map.removeAll();
    map.add(newFeaturesLayer);

    // Wait for the layer to load
    await newFeaturesLayer.load();

    // Zoom to the selected feature
    const query = newFeaturesLayer.createQuery();
    const result = await newFeaturesLayer.queryExtent(query);
    if (result.extent) {
      view.goTo(result.extent.expand(1.2));
    }
  } catch (error) {
    console.error(`Error loading layer: ${error}`);
    throw error;
  }
}

export { addLayer, removeLayer, removeAllLayers, addFeatureLayer };
