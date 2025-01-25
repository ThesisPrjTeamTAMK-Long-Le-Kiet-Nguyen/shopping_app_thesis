import { useState, useEffect } from 'react'
import { fetchRackets } from '../services/apiService' // Import the fetchRackets function

function RacketItem() {
  const [rackets, setRackets] = useState(null) // State to hold fetched rackets

  useEffect(() => {
    // Fetch rackets when the component mounts
    fetchRackets()
      .then((data) => setRackets(data))
      .catch((error) => console.error('Error fetching rackets:', error))
  }, [])

  return (
    <div>
      <h2>Rackets:</h2>
      {rackets ? (
        <ul>
          {rackets.map((racket) => (
            <li key={racket._id}>
              <h3>{racket.name}</h3>
              <p>Price: ${racket.price}</p>
              <p>Brand: {racket.brand}</p>
              <p>Series: {racket.series}</p>
              <p>Type: {racket.racketType}</p>
              <p>Flexibility: {racket.flexibility}</p>
              <p>Material: {racket.material}</p>
              <p>Balance Point: {racket.balancePoint} mm</p>
              <p>Cover: {racket.cover ? 'Yes' : 'No'}</p>
              {racket.colors.map((colorInfo, index) => (
                <div key={index}>
                  <p>Color: {colorInfo.color}</p>
                  <img
                    src={colorInfo.photo}
                    alt={`${racket.name} in ${colorInfo.color}`}
                    width="200"
                    height="auto"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                  {colorInfo.types.map((typeInfo, typeIndex) => (
                    <div key={typeIndex}>
                      <p>Type: {typeInfo.type}</p>
                      <p>Quantity: {typeInfo.quantity}</p>
                      <p>Max Tension: {typeInfo.maxTension}</p>
                    </div>
                  ))}
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading rackets...</p>
      )}
    </div>
  )
}

export default RacketItem