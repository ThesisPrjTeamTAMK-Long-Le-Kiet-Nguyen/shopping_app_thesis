import { useState, useEffect } from 'react'
import { fetchRackets } from '../../../services/apiService'
import { Link } from 'react-router-dom'

const RacketList = () => {
  const [rackets, setRackets] = useState(null)

  useEffect(() => {
    fetchRackets()
      .then((data) => setRackets(data))
      .catch((error) => console.error('Error fetching rackets:', error))
  }, [])

  const groupRackets = (rackets) => {
    return rackets.reduce((acc, racket) => {
      const { brand, series } = racket
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(racket)
      return acc
    }, {})
  }

  const groupedRackets = rackets ? groupRackets(rackets) : {}

  return (
    <div>
      <h2>Racket Items</h2>
      {rackets ? (
        Object.entries(groupedRackets).map(([brand, seriesMap]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            {Object.entries(seriesMap).map(([series, rackets]) => (
              <div key={series}>
                <h4>{series}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {rackets.map((racket) => (
                    <div
                      key={racket.id}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '200px',
                        textAlign: 'center',
                      }}
                    >
                      <Link to={`/racket/${racket.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                          src={racket.colors[0].photo}
                          alt={racket.name}
                          width="100%"
                          height="auto"
                          style={{ borderRadius: '8px' }}
                        />
                        <h3>{racket.name}</h3>
                        <p>Price: ${racket.price}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading rackets...</p>
      )}
    </div>
  )
}

export default RacketList