'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Building, SortOption, FilterOption } from '../app/types'

interface SidebarProps {
  buildings: Building[]
  selectedBuilding: Building | null
  onBuildingSelect: (building: Building) => void
  onSortChange: (sort: SortOption) => void
  onFilterChange: (filter: FilterOption) => void
}

export default function Sidebar({
  buildings,
  selectedBuilding,
  onBuildingSelect,
  onSortChange,
  onFilterChange,
}: SidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getCurrentDayHours = (building: Building) => {
    if (!building.hours) return null
    const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' })
    return building.hours[day] || null
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    onSortChange(newSort)
  }

  const handleFilterChange = (newFilter: FilterOption) => {
    setFilterBy(newFilter)
    onFilterChange(newFilter)
  }

  const displayedBuilding = selectedBuilding || buildings[0]

  return (
    <div className="w-96 h-screen bg-[#0a0a0a] border-r border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <h1 className="text-2xl font-semibold text-white">atlas</h1>
        </div>

        {/* Social Links */}
        <div className="flex gap-2 mb-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-400 mb-4">
          {formatDate(currentTime)}
        </div>

        {/* Sort and Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange(sortBy === 'name' ? 'name' : 'name')}
            className="flex items-center gap-2 border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Name
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleFilterChange(filterBy === 'all' ? 'all' : 'all')}
            className="flex items-center gap-2 border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Building Card */}
      {displayedBuilding && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="relative w-full h-48 bg-gray-800">
              {displayedBuilding.image ? (
                <Image
                  src={displayedBuilding.image}
                  alt={displayedBuilding.name}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    // Hide image on error
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                {displayedBuilding.name}
              </h2>
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-300">{displayedBuilding.rating}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${displayedBuilding.status === 'open' ? 'text-green-400' : 'text-red-400'}`}>
                  {displayedBuilding.status === 'open' ? 'Open today' : 'Closed today'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-300">{displayedBuilding.location}</span>
              </div>
              {displayedBuilding.distance && (
                <div className="text-sm text-gray-400 mb-2">
                  {displayedBuilding.distance.toFixed(1)} km away
                </div>
              )}
              {getCurrentDayHours(displayedBuilding) && (
                <div className="mt-4">
                  <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    View Hours
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="mt-2 text-sm text-gray-400">
                    {getCurrentDayHours(displayedBuilding)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
