'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Building } from '../app/types'

interface SidebarProps {
  buildings: Building[]
  selectedBuilding: Building | null
  onBuildingSelect: (building: Building) => void
  onSearchChange: (query: string) => void
}

export default function Sidebar({
  buildings,
  selectedBuilding,
  onBuildingSelect,
  onSearchChange,
}: SidebarProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Set initial time on client only to avoid hydration mismatch
    setCurrentTime(new Date())

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
    if (!building.hours || !currentTime) return null
    const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' })
    return building.hours[day] || null
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="w-96 h-screen bg-[#0a0a0a] border-r border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-blue-400 mt-0.5"></div>
          <h1 className="text-2xl font-semibold text-white">uwatlas</h1>
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
        </div>

        {/* Date and Time */}
        <div className="text-sm text-gray-400 mb-4">
          {currentTime ? formatDate(currentTime) : '\u00A0'}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Buildings List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {buildings.map((building) => {
            const isSelected = selectedBuilding?.id === building.id
            return (
              <div
                key={building.id}
                onClick={() => onBuildingSelect(building)}
                className={`bg-gray-900 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gray-500 bg-gray-800'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {/* Building Image */}
                <div className="relative w-full h-32 bg-gray-900 border border-gray-700">
                  {building.image ? (
                    <Image
                      src={building.image}
                      alt={building.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{building.name}</h3>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-300">{building.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          building.status === 'open' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      ></div>
                      <span
                        className={
                          building.status === 'open' ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {building.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    {building.category && (
                      <span className="text-gray-400">{building.category}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
