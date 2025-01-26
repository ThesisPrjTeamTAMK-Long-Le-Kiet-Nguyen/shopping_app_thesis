import { useState, useEffect } from 'react'
import { fetchBags } from '../../services/apiService'
import { Link } from 'react-router-dom'

function BagList() {
  const [bags, setBags] = useState(null)

  useEffect(() => {
    fetchBags()
      .then((data) => setBags(data))
      .catch((error) => console.error('Error fetching bags:', error))
  }, [])

  const groupBags = (bags) => {
    return bags.reduce((acc, bag) => {
      const { brand } = bag
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(bag)
      return acc
    }, {})
  }

  const groupedBags = bags ? groupBags(bags) : {}

  return (
    <div>
      <h2>Bag Items</h2>
      {bags ? (
        Object.entries(groupedBags).map(([brand, bags]) => (
          <div key={brand}>
            <h3>{brand}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {bags.map((bag) => (
                <div
                  key={bag._id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '200px',
                    textAlign: 'center',
                  }}
                >
                  <Link to={`/bags/${bag._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                      src={bag.colors[0].photo}
                      alt={bag.name}
                      width="100%"
                      height="auto"
                      style={{ borderRadius: '8px' }}
                    />
                    <h3>{bag.name}</h3>
                    <p>Price: ${bag.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading bags...</p>
      )}
    </div>
  )
}

export default BagList