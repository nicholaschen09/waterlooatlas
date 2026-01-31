export interface Building {
  id: string
  name: string
  rating: number
  status: 'open' | 'closed'
  location: string
  coordinates: [number, number] // [longitude, latitude]
  image?: string
  hours?: {
    [key: string]: string
  }
  distance?: number
  category?: string
}

export type SortOption = 'name' | 'rating' | 'distance'
export type FilterOption = 'all' | 'open' | 'closed'
