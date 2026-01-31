# UW Atlas

<img width="1677" height="932" alt="Screenshot 2026-01-31 at 11 50 20 AM" src="https://github.com/user-attachments/assets/01dd5c5c-8afd-482a-8f7f-8f47288ab86b" />


An interactive campus map for University of Waterloo, inspired by [UofT Atlas](https://www.uoftatlas.com/).

## Features

- Interactive Mapbox map showing campus buildings
- Building information cards with ratings, hours, and status
- Real-time filtering and sorting
- Dark theme UI
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

**No API keys required!** This app uses Leaflet with OpenStreetMap, which is completely free and open-source (just like Waterloo's own campus map).

## Adding Building Images

To add building images:
1. Place images in the `public/images/` directory
2. Update the `image` property in `app/api/buildings/route.ts` to point to your images
3. Images are optional - the app will show a placeholder if no image is provided

## Building Data

Building data is stored in `app/api/buildings/route.ts`. You can customize the buildings, coordinates, and information there.

## Technologies

- Next.js 14
- React
- TypeScript
- Leaflet (free, open-source mapping library)
- OpenStreetMap (free map tiles)
- Tailwind CSS

**No API keys or signups required!** This uses completely free and open-source mapping technology.
