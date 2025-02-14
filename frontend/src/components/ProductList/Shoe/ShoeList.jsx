import { useState, useEffect } from 'react'
import { fetchShoes } from '../../../services/productService'
import { Link } from 'react-router-dom'

const ShoeList = () => {
  const [shoes, setShoes] = useState(null)

  useEffect(() => {
    fetchShoes()
      .then((data) => setShoes(data))
      .catch((error) => console.error('Error fetching shoes:', error))
  }, [])

  const groupShoes = (shoes) => {
    return shoes.reduce((acc, shoe) => {
      const { brand, series } = shoe
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(shoe)
      return acc
    }, {})
  }

  const groupedShoes = shoes ? groupShoes(shoes) : {}

  return (
    <div>
      <h2>Shoe Items</h2>
      {shoes ? (
        Object.entries(groupedShoes).map(([brand, seriesMap]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            {Object.entries(seriesMap).map(([series, shoes]) => (
              <div key={series}>
                <h4>{series}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {shoes.map((shoe) => (
                    <div
                      key={shoe.id}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '200px',
                        textAlign: 'center',
                      }}
                    >
                      <Link to={`/shoes/${shoe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                          src={shoe.colors[0].photo}
                          alt={shoe.name}
                          width="100%"
                          height="auto"
                          style={{ borderRadius: '8px' }}
                        />
                        <h3>{shoe.name}</h3>
                        <p>Price: ${shoe.price}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading shoes...</p>
      )}
    </div>
  )
}

export default ShoeList