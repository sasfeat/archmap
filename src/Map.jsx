import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to fit map bounds to show all markers
function MapBounds({ data }) {
  const map = useMap()
  
  useEffect(() => {
    if (data.length > 0) {
      const bounds = data
        .filter(item => item.coords)
        .map(item => {
          const [lat, lng] = item.coords.split(',').map(Number)
          return [lat, lng]
        })
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [data, map])
  
  return null
}

// Helper function to construct image URL
function getImageUrl(item) {
  if (!item.id || !item.img || !item.hash) {
    return null
  }
  return `https://arquitecturaviva.com/assets/uploads/obras/${item.id}/av_thumb__${item.img}?h=${item.hash}`
}

function Map({ data }) {
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

  // Calculate center point (average of all coordinates)
  const center = markers.length > 0
    ? markers.reduce(
        (acc, marker) => [
          acc[0] + marker.position[0],
          acc[1] + marker.position[1]
        ],
        [0, 0]
      ).map(sum => sum / markers.length)
    : [40.4168, -3.7038] // Default to Madrid, Spain

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds data={data} />
        {markers.map((item, index) => {
          const imageUrl = getImageUrl(item)
          return (
            <Marker key={item.id || index} position={item.position}>
              <Popup>
                <div style={{ minWidth: '200px', maxWidth: '300px' }}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.title || 'Architecture photo'}
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
                    {item.title}
                  </h3>
                  {item.author && item.author.length > 0 && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                      <strong>Author:</strong> {item.author.join(', ')}
                    </p>
                  )}
                  {item.city && item.city.length > 0 && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                      <strong>City:</strong> {item.city.join(', ')}
                    </p>
                  )}
                  {item.country && item.country.length > 0 && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                      <strong>Country:</strong> {item.country.join(', ')}
                    </p>
                  )}
                  {item.date && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                      <strong>Date:</strong> {item.date}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default Map

