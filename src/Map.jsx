import { useState, useEffect, useCallback } from 'react'
import MapLibreMap, { Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

// Helper function to construct image URL
function getImageUrl(item) {
  if (!item.id || !item.img || !item.hash) {
    return null
  }
  return `https://arquitecturaviva.com/assets/uploads/obras/${item.id}/av_thumb__${item.img}?h=${item.hash}`
}

// Custom marker component
function CustomMarker({ item, onClick }) {
  return (
    <Marker
      longitude={item.position[1]}
      latitude={item.position[0]}
      anchor="bottom"
    >
      <div
        style={{
          cursor: 'pointer',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#2c3e50',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClick}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#3498db'
          }}
        />
      </div>
    </Marker>
  )
}

function MapComponent({ data }) {
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: -3.7038,
    latitude: 40.4168,
    zoom: 6
  })

  // Parse coordinates and filter out invalid entries
  const markers = data
    .filter(item => item.coords && item.coords.includes(','))
    .map(item => {
      const [lat, lng] = item.coords.split(',').map(Number)
      return {
        ...item,
        position: [lat, lng]
      }
    })
    .filter(item => !isNaN(item.position[0]) && !isNaN(item.position[1]))

  // Calculate center point and fit bounds on initial load
  useEffect(() => {
    if (markers.length > 0) {
      const lngs = markers.map(m => m.position[1])
      const lats = markers.map(m => m.position[0])
      
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      
      const centerLng = (minLng + maxLng) / 2
      const centerLat = (minLat + maxLat) / 2
      
      // Calculate zoom level based on bounds
      const lngDiff = maxLng - minLng
      const latDiff = maxLat - minLat
      const maxDiff = Math.max(lngDiff, latDiff)
      
      let zoom = 6
      if (maxDiff < 0.1) zoom = 10
      else if (maxDiff < 0.5) zoom = 8
      else if (maxDiff < 1) zoom = 7
      else if (maxDiff < 5) zoom = 6
      else zoom = 4
      
      setViewState({
        longitude: centerLng,
        latitude: centerLat,
        zoom: zoom
      })
    }
  }, [markers.length])

  const handleMarkerClick = useCallback((item) => {
    setSelectedMarker(item)
  }, [])

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapLibreMap
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {markers.map((item, index) => (
          <CustomMarker
            key={item.id || index}
            item={item}
            onClick={() => handleMarkerClick(item)}
          />
        ))}
        
        {selectedMarker && (
          <Popup
            longitude={selectedMarker.position[1]}
            latitude={selectedMarker.position[0]}
            anchor="bottom"
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div style={{ minWidth: '200px', maxWidth: '300px' }}>
              {getImageUrl(selectedMarker) && (
                <img
                  src={getImageUrl(selectedMarker)}
                  alt={selectedMarker.title || 'Architecture photo'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: '0.75rem',
                    borderRadius: '4px',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', lineHeight: '1.3' }}>
                {selectedMarker.title}
              </h3>
              {selectedMarker.author && selectedMarker.author.length > 0 && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                  <strong>Author:</strong> {selectedMarker.author.join(', ')}
                </p>
              )}
              {selectedMarker.city && selectedMarker.city.length > 0 && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                  <strong>City:</strong> {selectedMarker.city.join(', ')}
                </p>
              )}
              {selectedMarker.country && selectedMarker.country.length > 0 && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                  <strong>Country:</strong> {selectedMarker.country.join(', ')}
                </p>
              )}
              {selectedMarker.date && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                  <strong>Date:</strong> {selectedMarker.date}
                </p>
              )}
            </div>
          </Popup>
        )}
      </MapLibreMap>
    </div>
  )
}

export default MapComponent
