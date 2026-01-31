'use client'

import { useState, useEffect } from 'react'
import Map from '../components/Map'
import Sidebar from '../components/Sidebar'
import { Building, SortOption, FilterOption } from './types'

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

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

    // Apply filter
    if (filterBy === 'open') {
      filtered = filtered.filter(b => b.status === 'open')
    } else if (filterBy === 'closed') {
      filtered = filtered.filter(b => b.status === 'closed')
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        default:
          return 0
      }
    })

    setFilteredBuildings(filtered)
  }, [buildings, sortBy, filterBy])

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
  }

  const handleFilterChange = (filter: FilterOption) => {
    setFilterBy(filter)
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        buildings={filteredBuildings}
        selectedBuilding={selectedBuilding}
        onBuildingSelect={handleBuildingClick}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
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
