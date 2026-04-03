"use client";
import WorldMap from "@/components/ui/world-map";

export function WorldMapDemo() {
  return (
    <WorldMap
      lineColor="#DE5E03"
      dots={[
        {
          // Delhi → San Francisco
          start: { lat: 28.6139, lng: 77.209 },
          end: { lat: 37.7749, lng: -122.4194 },
        },
        {
          // Delhi → London
          start: { lat: 28.6139, lng: 77.209 },
          end: { lat: 51.5074, lng: -0.1278 },
        },
        {
          // London → San Francisco
          start: { lat: 51.5074, lng: -0.1278 },
          end: { lat: 37.7749, lng: -122.4194 },
        },
      ]}
    />
  );
}
