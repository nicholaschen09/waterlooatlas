'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L, { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building } from '../app/types'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapProps {
  buildings: Building[]
  selectedBuilding: Building | null
  onBuildingClick: (building: Building) => void
}

// Component to handle map view changes and open popup
function MapController({ selectedBuilding, markerRefs }: { selectedBuilding: Building | null, markerRefs: React.MutableRefObject<globalThis.Map<string, any>> }) {
  const map = useMap()

  useEffect(() => {
    if (selectedBuilding) {
      const position: [number, number] = [selectedBuilding.coordinates[1], selectedBuilding.coordinates[0]]
      
      map.flyTo(
        position,
        17,
        { duration: 1 }
      )

      // Open popup after animation completes (duration is 1 second)
      const timer = setTimeout(() => {
        const marker = markerRefs.current.get(selectedBuilding.id)
        if (marker) {
          marker.openPopup()
        }
      }, 1100) // Slightly longer than animation duration

      return () => clearTimeout(timer)
    }
  }, [selectedBuilding, map, markerRefs])

  return null
}

// Component to show user's current location
function UserLocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )

    // Watch position for updates
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (error) => {
        console.error('Error watching location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  if (!position) return null

  // Create blue dot icon for user location
  const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #3b82f6;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>Your location</Popup>
    </Marker>
  )
}

export default function Map({ buildings, selectedBuilding, onBuildingClick }: MapProps) {
  // Waterloo campus center coordinates [lat, lng] for Leaflet
  const WATERLOO_CENTER: [number, number] = [43.4715, -80.5444]
  const [map, setMap] = useState<LeafletMap | null>(null)
  const markerRefs = useRef<globalThis.Map<string, any>>(new globalThis.Map())

  // Create custom markers
  const createCustomIcon = (building: Building) => {
    const color = building.status === 'open' ? '#10b981' : '#ef4444'
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${color};
        box-shadow: 0 0 10px ${color}80;
        cursor: pointer;
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })
  }

  const handleReset = () => {
    if (map) {
      map.flyTo([43.4715, -80.5444], 16, { duration: 1 })
    }
  }

  const handleFlyToMe = () => {
    if (!map) return

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        map.flyTo(
          [lat, lng],
          17,
          {
            duration: 1.5,
            animate: true
          }
        )
      },
      error => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={WATERLOO_CENTER}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={setMap}
      >
        {/* Dark theme tile layer - CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedBuilding={selectedBuilding} markerRefs={markerRefs} />

        {/* User's current location */}
        <UserLocationMarker />

        {buildings.map(building => (
          <Marker
            key={building.id}
            position={[building.coordinates[1], building.coordinates[0]]}
            icon={createCustomIcon(building)}
            ref={(ref) => {
              if (ref) {
                markerRefs.current.set(building.id, ref)
              } else {
                markerRefs.current.delete(building.id)
              }
            }}
            eventHandlers={{
              click: () => onBuildingClick(building),
            }}
          >
            <Popup>
              <div className="text-black">
                <strong>{building.name}</strong>
                <br />
                <span className={building.status === 'open' ? 'text-green-600' : 'text-red-600'}>
                  {building.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Controls outside MapContainer */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleReset}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Map
        </button>
        <button
          onClick={handleFlyToMe}
          type="button"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Fly to Me
        </button>
      </div>
    </div>
  )
}

