'use client'

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import L, { Icon, LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useState } from 'react'
import { saveAs } from 'file-saver';

export default function Home(this: any) {

  const center: LatLngExpression = [0, 0];
  const bounds: LatLngBoundsExpression | undefined = [[-90, -180], [90, 180]];
  const [geoFile, setGeoFile] = useState<File>();
  const [geoContent, setGeoContent] = useState<any>(null);
  const geoHeaders  = useRef<any>();
  const [markers, setMarkers] = useState<[number, number][]>([]);
  const [fileNum, setFileNum] = useState<number>(1);
  const geoJsonRef = useRef<any>()


  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.clearLayers()
      geoJsonRef.current.addData(geoContent)
    }
  }, [geoJsonRef, geoContent])

  const markerIcon = new Icon(
    {
      iconUrl: ("./pin.png"),
      iconSize: [30, 30]
    }
  );

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers([...markers, [lat, lng]]);
      },
    });
    return null;
  };

  L.Marker.prototype.options.icon = L.icon({
    iconUrl: ("./point.png"),
    iconSize: [12, 12]
  });

function onEachFeature(feature: any, layer: L.Layer) {
  if (feature.properties) {
    let popupContent = ''; 

    geoHeaders.current.forEach((geoHeader: any) => {
      let { [geoHeader]: headerValue } = feature.properties;
      popupContent += `${geoHeader}: ${headerValue} `; 
    });
    layer.bindPopup(popupContent); 
  }
}

  const handleGeoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setGeoFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setGeoContent(JSON.parse(content));
        geoHeaders.current = Object.getOwnPropertyNames(JSON.parse(content).features[0].properties);
      };
      reader.readAsText(file);
    }
  };

  const exportFile = () => {
    const features = markers.map((position) => ({
      type: "Feature",
      properties: {
        "lng": `${position[0]}`,
        "lat": `${position[1]}`
      },
      geometry: {
        type: "Point",
        coordinates: [position[1], position[0]]
      }
    }));

    const geojsonData = {
      type: "FeatureCollection",
      features: features
    };
    const blob = new Blob([JSON.stringify(geojsonData)], { type: "application/json" });
    saveAs(blob, `marker${fileNum}.geojson`);
    setFileNum(fileNum + 1);
  };

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
            <span>{"Clear"}</span>
          </button>
        )}
      </div>

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

        <LocationMarker />
        {markers.map((position, index) => (
          <Marker key={index} position={position} icon={markerIcon} />
        ))}

        {geoContent != null ? (
          < GeoJSON data={geoContent} onEachFeature={onEachFeature} ref={geoJsonRef} />
        ) : null}
      </MapContainer >

    </>
  );
}