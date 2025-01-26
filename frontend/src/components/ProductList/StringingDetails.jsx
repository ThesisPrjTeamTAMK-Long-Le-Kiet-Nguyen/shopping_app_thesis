import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchStringings } from '../../services/apiService'

const StringingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stringing, setStringing] = useState(null)

  useEffect(() => {
    fetchStringings()
      .then((data) => {
        const selectedStringing = data.find((s) => s._id === id)
        setStringing(selectedStringing)
      })
      .catch((error) => console.error('Error fetching stringing details:', error))
  }, [id])

  if (!stringing) {
    return <p>Loading stringing details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
      <h3>{stringing.name}</h3>
      <p>Price: ${stringing.price}</p>
      <p>Brand: {stringing.brand}</p>
      <p>Series: {stringing.series}</p>
      <p>Gauge: {stringing.gauge} mm</p>
      <p>Type: {stringing.type}</p>
      {stringing.colors.map((colorInfo, index) => (
        <div key={index}>
          <p>Color: {colorInfo.color}</p>
          <img
            src={colorInfo.photo}
            alt={`${stringing.name} in ${colorInfo.color}`}
            width="200"
            height="auto"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
          <p>Quantity: {colorInfo.quantity}</p>
        </div>
      ))}
    </div>
  )
}

export default StringingDetails