// WeatherMap.js
import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const WeatherMap = ({ lat, lon, city }) => {
  return (
    <div className="weather-map-container" style={{ height: '200px', width: '100%', marginTop: '20px' }}>
      <Map center={[lat, lon]}
                      zoom={10}
                    scrollWheelZoom={false}
                    className="leaflet-container"
                        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>📍 {city || 'Your Location'}</Popup>
        </Marker>
      </Map>
    </div>
  );
};

export default WeatherMap;
