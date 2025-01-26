import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../services/apiService'
import { Link } from 'react-router-dom'

function ShuttlecockList() {
  const [shuttlecocks, setShuttlecocks] = useState(null)

  useEffect(() => {
    fetchShuttlecocks()
      .then((data) => setShuttlecocks(data))
      .catch((error) => console.error('Error fetching shuttlecocks:', error))
  }, [])

  const groupShuttlecocks = (shuttlecocks) => {
    return shuttlecocks.reduce((acc, shuttlecock) => {
      const { brand } = shuttlecock
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(shuttlecock)
      return acc
    }, {})
  }

  const groupedShuttlecocks = shuttlecocks ? groupShuttlecocks(shuttlecocks) : {}

  return (
    <div>
      <h2>Shuttlecock Items</h2>
      {shuttlecocks ? (
        Object.entries(groupedShuttlecocks).map(([brand, shuttlecocks]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {shuttlecocks.map((shuttlecock) => (
                <div
                  key={shuttlecock._id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '200px',
                    textAlign: 'center',
                  }}
                >
                  <Link to={`/shuttlecocks/${shuttlecock._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                      src={shuttlecock.colors[0].photo}
                      alt={shuttlecock.name}
                      width="100%"
                      height="auto"
                      style={{ borderRadius: '8px' }}
                    />
                    <h3>{shuttlecock.name}</h3>
                    <p>Price: ${shuttlecock.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading shuttlecocks...</p>
      )}
    </div>
  )
}

export default ShuttlecockList