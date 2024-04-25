"use client"
import React from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from 'react';

export default function Home() {

  const [geoFile, setGeoFile] = useState<File>();
  const [geoContent, setGeoContent] = useState<any>(null);

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

  useEffect(() => {
    if (geoContent != null) {
      console.log(typeof (geoContent));
      console.log(geoContent);
    }
  }, [geoContent])

  return (
    <>

      <div className='flex border-2 border-black box-content h-10vw w-56 p-4 center'>
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
      </div>

      <MapContainer center={[13.75, 100.7]} zoom={10.5} scrollWheelZoom={true}>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoContent != null && (
          < GeoJSON data={geoContent} />
        )}

      </MapContainer>

    </>
  );
}


