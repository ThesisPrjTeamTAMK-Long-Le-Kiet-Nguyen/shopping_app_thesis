import { useState, useEffect } from 'react'
import { fetchGrips } from '../../services/apiService'
import { Link } from 'react-router-dom'

function GripList() {
  const [grips, setGrips] = useState(null)

  useEffect(() => {
    fetchGrips()
      .then((data) => setGrips(data))
      .catch((error) => console.error('Error fetching grips:', error))
  }, [])

  const groupGrips = (grips) => {
    return grips.reduce((acc, grip) => {
      const { brand } = grip
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(grip)
      return acc
    }, {})
  }

  const groupedGrips = grips ? groupGrips(grips) : {}

  return (
    <div>
      <h2>Grip Items</h2>
      {grips ? (
        Object.entries(groupedGrips).map(([brand, grips]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {grips.map((grip) => (
                <div
                  key={grip._id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '200px',
                    textAlign: 'center',
                  }}
                >
                  <Link to={`/grips/${grip._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                      src={grip.colors[0].photo}
                      alt={grip.name}
                      width="100%"
                      height="auto"
                      style={{ borderRadius: '8px' }}
                    />
                    <h3>{grip.name}</h3>
                    <p>Price: ${grip.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading grips...</p>
      )}
    </div>
  )
}

export default GripList