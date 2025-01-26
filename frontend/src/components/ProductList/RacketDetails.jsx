import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchRackets } from '../../services/apiService'

const RacketDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [racket, setRacket] = useState(null)

  useEffect(() => {
    fetchRackets()
      .then((data) => {
        const selectedRacket = data.find((r) => r._id === id)
        setRacket(selectedRacket)
      })
      .catch((error) => console.error('Error fetching racket details:', error))
  }, [id])

  if (!racket) {
    return <p>Loading racket details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
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
    </div>
  )
}

export default RacketDetails