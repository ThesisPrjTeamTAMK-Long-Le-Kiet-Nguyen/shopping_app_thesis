import { useState, useEffect } from 'react'
import { fetchStringings } from '../../services/apiService'
import { Link } from 'react-router-dom'

function StringingList() {
  const [stringings, setStringings] = useState(null)

  useEffect(() => {
    fetchStringings()
      .then((data) => setStringings(data))
      .catch((error) => console.error('Error fetching stringings:', error))
  }, [])

  const groupStringings = (stringings) => {
    return stringings.reduce((acc, stringing) => {
      const { brand, series } = stringing
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(stringing)
      return acc
    }, {})
  }

  const groupedStringings = stringings ? groupStringings(stringings) : {}

  return (
    <div>
      <h2>Stringing Items</h2>
      {stringings ? (
        Object.entries(groupedStringings).map(([brand, seriesMap]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            {Object.entries(seriesMap).map(([series, stringings]) => (
              <div key={series}>
                <h4>{series}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {stringings.map((stringing) => (
                    <div
                      key={stringing._id}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '200px',
                        textAlign: 'center',
                      }}
                    >
                      <Link to={`/stringings/${stringing._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                          src={stringing.colors[0].photo}
                          alt={stringing.name}
                          width="100%"
                          height="auto"
                          style={{ borderRadius: '8px' }}
                        />
                        <h3>{stringing.name}</h3>
                        <p>Price: ${stringing.price}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading stringings...</p>
      )}
    </div>
  )
}

export default StringingList