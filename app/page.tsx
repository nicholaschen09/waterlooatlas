'use client'

import { useState, useEffect } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import { Building } from './types'

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      <Sidebar
        buildings={filteredBuildings}
        selectedBuilding={selectedBuilding}
        onBuildingSelect={handleBuildingClick}
        onSearchChange={handleSearchChange}
      />
      <div className="flex-1 relative">
        <Map
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onBuildingClick={handleBuildingClick}
        />
      </div>
    </main>
  )
}
