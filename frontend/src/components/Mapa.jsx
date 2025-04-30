import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import markerIcon from "../assets/iconbus.png";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Mapa = () => {
  const [ubicacion, setUbicacion] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCkuZxLRkaFNPzhxfihATnjyjY8JeFqz7o",
  });

  const [mostrarInfo, setMostrarInfo] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="w-full h-full">
      {ubicacion ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={ubicacion}
          zoom={15}
        >
          <Marker
            position={ubicacion}
            icon={{
              url: markerIcon,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            onClick={() => setMostrarInfo(true)} // Abrir InfoWindow al hacer click
          />
          {mostrarInfo && (
            <InfoWindow
              position={ubicacion}
              onCloseClick={() => setMostrarInfo(false)} // Cerrar InfoWindow
            >
              <div className="p-4">
                <h2 className="font-bold text-lg">Bus Guaireña 150</h2>
                <p><strong>Origen:</strong>Villarrica</p>
                <p><strong>Destino:</strong>Ciudad del Este</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Reservar
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  );
};

export default Mapa;