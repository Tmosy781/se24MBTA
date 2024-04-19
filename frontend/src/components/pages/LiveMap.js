import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from '../images/Capture.JPG';
import blueLineMarkerIcon from '../images/blueLine.png';
import greenLineMarkerIcon from '../images/green_line.png';
import redLineMarkerIcon from '../images/redLine.png';
import orangeLineMarkerIcon from '../images/orangeLine.png';
import axios from 'axios';
import Alerts from './mbtaAlerts';
import Button from 'react-bootstrap/Button';
import getUserInfo from "../../utilities/decodeJwt";

function formatStatus(status) {
  return status.toLowerCase().replace(/_/g, ' ');
}

function LiveMap() {
  const url = process.env.REACT_APP_BACKEND_SERVER_URI;
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [stops, setStops] = useState({});
  const [description, setDescription] = useState({});
  const [map, setMap] = useState(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [notes, setNotes] = useState({});

  const fetchNotes = async (username) => {
    try {
      let response = await axios.get(`${url}/note/byId/?userId=${username}`);
      if (!response.data.stationId) {
        response.data.stationId = {}
      }
      setNotes(response.data.stationId);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  useEffect(() => {
    const initializeNotes = async () => {
      const userInfo = getUserInfo();
      if (userInfo && userInfo.username) {
        await fetchNotes(userInfo.username);
      } else {
        console.error("User information is not available.");
      }
    };

    initializeNotes();

    const leafletMap = L.map('map').setView([42.3601, -71.0589], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(leafletMap);

    setMap(leafletMap);

    const fetchData = async () => {
      try {
        const vehicleResult = await axios.get('https://api-v3.mbta.com/vehicles?filter%5Broute_type%5D=1');
        setVehicles(vehicleResult.data.data);

        const stopResult = await axios.get('https://api-v3.mbta.com/stops?filter%5Broute_type%5D=1');
        const stopsData = await stopResult.data.data.reduce((acc, stop) => {
          acc[stop.id] = stop.attributes.name;
          return acc;
        }, {});
        setStops(stopsData);

        const descriptionResult = await axios.get('https://api-v3.mbta.com/stops?filter%5Broute_type%5D=1');
        const descriptionData = descriptionResult.data.data.reduce((acc, stop) => {
          acc[stop.id] = stop.attributes.name;
          return acc;
        }, {});
        setDescription(descriptionData);

        const stationResult = await fetch("https://api-v3.mbta.com/stops?filter[route_type]=1");

        const stationData = await stationResult.json();
        setStations(stationData.data.map((station) => ({
          name: station.attributes.name,
          longitude: station.attributes.longitude,
          latitude: station.attributes.latitude,
          description: station.attributes.description
        })));

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();

    const refreshInterval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      stations.forEach((station) => {
        const { latitude, longitude, name, description } = station || {};
        if (latitude && longitude) {
          const stationName = name || 'Unknown Stop';
          const stationDescription = description || 'No Description';
          const note = notes[stationName] || "No note "

          let markerSize = [35, 35];

          const stationMarker = L.marker([latitude, longitude], { icon: L.icon({ iconUrl: customMarkerIcon, iconSize: markerSize }) });

          stationMarker.addTo(map).bindPopup(`${stationName}<br/>Description: ${stationDescription.replace(`${stationName} - `, '')}<br/>Note: ${note}`);
        }
      });

      vehicles.forEach((vehicle) => {
        const { latitude, longitude, current_status } = vehicle.attributes || {};
        if (latitude && longitude && vehicle.relationships.stop && vehicle.relationships.stop.data) {
          const stopId = vehicle.relationships.stop.data.id;
          const stopName = stops[stopId] || 'Unknown Stop';

          let markerIcon = customMarkerIcon;
          let markerSize = [32, 32];
          const routeId = vehicle.relationships.route.data.id;
          switch (routeId) {
            case "Blue":
              markerIcon = blueLineMarkerIcon;
              break;
            case "Red":
              markerIcon = redLineMarkerIcon;
              break;
            case "Green":
              markerIcon = greenLineMarkerIcon;
              break;
            case "Orange":
              markerIcon = orangeLineMarkerIcon;
              break;
          }

          const formattedStatus = formatStatus(current_status);
          const customMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: markerIcon,
              iconSize: markerSize
            })
          });

          customMarker.addTo(map).bindPopup(`${routeId} Line<br/>currently ${formattedStatus}<br/>${stopName}`);
        }
      });

    }

  }, [map, vehicles, stops, description, stations]);
  const toggleAlerts = () => setShowAlerts(!showAlerts);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000
      }}>
        <Button onClick={toggleAlerts} style={{ marginBottom: '10px' }}>Toggle Alerts</Button>
      </div>
      {showAlerts && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          maxHeight: '90%',
          width: '400px',
          overflowY: 'auto',
          border: '5px solid grey',
          borderRadius: '10px',
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          <Button onClick={toggleAlerts} style={{ width: '100%' }}>Toggle Alerts</Button>
          <Alerts />
        </div>
      )}
    </div>
  );
}

export default LiveMap;
