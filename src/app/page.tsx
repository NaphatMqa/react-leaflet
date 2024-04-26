'use client'

import React from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import dynamic from 'next/dynamic'
//import NoSSR from 'react-no-ssr';
import { Icon, LatLng, LatLngBoundsExpression, LatLngExpression, bounds, map } from "leaflet";
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { saveAs } from 'file-saver';



const DefaultOnSSR: React.FC = () => null

export const NoSSR: React.FC<{ children: ReactNode; onSSR?: ReactNode }> = ({ children, onSSR = <DefaultOnSSR /> }) => {
  const [onBrowser, setOnBrowser] = useState(false)
  useLayoutEffect(() => {
    setOnBrowser(true)
  }, [])
  return <>{onBrowser ? children : onSSR}</>
}

export default function Home(this: any) {
  const center: LatLngExpression = [0, 0];
  const zoom = 5;
  const bounds: LatLngBoundsExpression | undefined = [[-90, -180], [90, 180]];

  const markerIcon = new Icon(
    {
      iconUrl: ("./pin.png"),
      iconSize: [30, 30]
    }
  );

  const [geoFile, setGeoFile] = useState<File>();
  const [geoContent, setGeoContent] = useState<any>(null);
  const [markers, setMarkers] = useState<[number, number][]>([]);

  const handleGeoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setGeoFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setGeoContent(JSON.parse(content));
      };
      reader.readAsText(file);
    }
  };

  const LocationFinder = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers([...markers, [lat, lng]]);
      },
    });
    return null;
  };

  const exportFile = () => {
    const features = markers.map((position) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: position
      }
    }));

    const geojsonData = {
      type: "FeatureCollection",
      features: features
    };
    const blob = new Blob([JSON.stringify(geojsonData)], { type: "application/json" });
    saveAs(blob, "markers.geojson");
  };

  /*
      const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
        ssr: false
      });
    
      const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
        ssr: false
      });
      
      const GeoJSON = dynamic(() => import('react-leaflet').then((mod) => mod.GeoJSON), {
        ssr: false
      });
      
      const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.GeoJSON), {
        ssr: false
      });
    */

  return (
    <>
      <div className='flex space-x-3 border-2 border-blue-300 m-4 rounded-lg box-content h-10vw w-fit p-4 center'>
        <label>
          <input
            type="file"
            accept=".geojson"
            hidden
            onChange={handleGeoChange}
          />
          <div className="HeaderButton flex items-center justify-center border-2 cursor-pointer">
            <span>Geojson</span>
          </div>
        </label>

        {/*geoContent != null ? (
          <button
            className="HeaderButton flex items-center justify-center border-2 cursor-pointer"
            onClick={() => setGeoContent(null)}>
            <span>Reset polygon</span>
          </button>
        ) : (
          <button
            type="button"
            className="DisableButton flex items-center justify-center" disabled
          >
            Reset polygon
          </button>
        )*/}

        {markers.length > 0 ? (
          <button 
          className="HeaderButton flex items-center justify-center border-2 cursor-pointer"
          onClick={exportFile}>
            <span>Export</span>
          </button>
        ) : (
          <button
            type="button"
            className="DisableButton flex items-center justify-center" disabled>
            Export
          </button>
        )}

        {markers.length > 0 ? (
          <button
            className="HeaderButton p-3 flex items-center justify-center border-2 cursor-pointer"
            onClick={() => setMarkers([])}>
            <span>Clear</span>
          </button>
        ) : (
          <button
            type="button"
            className="DisableButton p-3 flex items-center justify-center" disabled>
            <span>{"Clear Mark"}</span>
          </button>
        )}
      </div>
      <NoSSR>
        <MapContainer
          center={center}
          zoom={2.5}
          scrollWheelZoom={true}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          bounceAtZoomLimits={true}
          minZoom={2.5}
        >

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocationFinder />
          {markers.map((position, index) => (
            <Marker key={index} position={position} icon={markerIcon} />
          ))}

          {geoContent != null ? (
            < GeoJSON data={geoContent} />
          ) : null}
        </MapContainer >
      </NoSSR>
    </>
  );
}