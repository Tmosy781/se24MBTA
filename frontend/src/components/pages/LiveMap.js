import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from '../images/mbta.png';
import axios from 'axios';

function LiveMap() {
  const [vehicles, setVehicles] = useState([]);
  const [stops, setStops] = useState({});
  const [description, setDescription] = useState({});
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Create a Leaflet map centered around Boston when the component mounts
    const leafletMap = L.map('map').setView([42.3601, -71.0589], 13);

    // Add a TileLayer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(leafletMap);

    setMap(leafletMap);

    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const vehicleResult = await axios.get('https://api-v3.mbta.com/vehicles?filter%5Broute_type%5D=1');
        setVehicles(vehicleResult.data.data);

        const stopResult = await axios.get('https://api-v3.mbta.com/stops?filter%5Broute_type%5D=1');
        const stopsData = stopResult.data.data.reduce((acc, stop) => {
          acc[stop.id] = stop.attributes.name;
          return acc;
        }, {});
        setStops(stopsData);

        const descriptionResult = await axios.get('https://api-v3.mbta.com/stops?filter%5Broute_type%5D=1');
        const descriptionData = descriptionResult.data.data.reduce((acc, stop) => {
          acc[stop.id] = stop.attributes.description;
          return acc;
        }, {});
        setDescription(descriptionData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();

    // Set up an interval to refresh data every 60 seconds (adjust as needed)
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 10000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(refreshInterval);
    };
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    if (map) {
      // Remove existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for each vehicle
      vehicles.forEach((vehicle) => {
        const { latitude, longitude, label } = vehicle.attributes || {};
        if (latitude && longitude && vehicle.relationships.stop && vehicle.relationships.stop.data) {
          const stopId = vehicle.relationships.stop.data.id;
          const stopName = stops[stopId] || 'Unknown Stop';
          const stopDescription = description[stopId] || 'No Description';
      
          // Create a custom marker with the custom icon
          const customMarker = L.marker([latitude, longitude], { icon: L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32] }) });
      
          // Add the custom marker to the map
          customMarker.addTo(map).bindPopup(`Vehicle: #${label}<br/>Stop: ${stopName}<br/>Description: ${stopDescription.replace(`${stopName} - `, '')}`);
        }
      });
    }
  }, [map, vehicles, stops, description]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div id="map" style={{ height: '500px', width: '80%', border: '2px solid #ccc', borderRadius: '10px' }}></div>
    </div>
  );
}

export default LiveMap;