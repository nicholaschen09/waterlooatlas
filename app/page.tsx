'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/Sidebar'
import { Building } from './types'

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
})

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetch('/api/buildings')
      .then(res => res.json())
      .then(data => {
        setBuildings(data)
        setFilteredBuildings(data)
      })
      .catch(err => console.error('Error fetching buildings:', err))
  }, [])

  useEffect(() => {
    let filtered = [...buildings]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        building =>
          building.name.toLowerCase().includes(query) ||
          building.category?.toLowerCase().includes(query) ||
          building.location.toLowerCase().includes(query)
      )
    }

    // Sort by name by default
    filtered.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredBuildings(filtered)
  }, [buildings, searchQuery])

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingClick}
          onSearchChange={handleSearchChange}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Map
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onBuildingClick={handleBuildingClick}
        />
      </div>
    </main>
  )
}
