
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

const MapComponent: React.FC = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) {

        }
    }, []);

    return (
        <>
        {/* 
            <MapContainer center={[13.75, 100.7]} zoom={10.5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoContent != null && (
                    < GeoJSON data={geoContent} />
                )}

            </MapContainer>;
        */}
        </>
    )
};

export default MapComponent;
