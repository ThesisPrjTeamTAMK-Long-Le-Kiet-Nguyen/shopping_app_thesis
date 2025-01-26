import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../services/apiService'

function ShuttlecockDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shuttlecock, setShuttlecock] = useState(null)

  useEffect(() => {
    fetchShuttlecocks()
      .then((data) => {
        const selectedShuttlecock = data.find((s) => s._id === id)
        setShuttlecock(selectedShuttlecock)
      })
      .catch((error) => console.error('Error fetching shuttlecock details:', error))
  }, [id])

  if (!shuttlecock) {
    return <p>Loading shuttlecock details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
      <h3>{shuttlecock.name}</h3>
      <p>Price: ${shuttlecock.price}</p>
      <p>Brand: {shuttlecock.brand}</p>
      <p>Feather Type: {shuttlecock.featherType}</p>
      <p>Units Per Tube: {shuttlecock.unitsPerTube}</p>
      {shuttlecock.colors.map((colorInfo, index) => (
        <div key={index}>
          <p>Color: {colorInfo.color}</p>
          <img
            src={colorInfo.photo}
            alt={`${shuttlecock.name} in ${colorInfo.color}`}
            width="200"
            height="auto"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
          {colorInfo.types.map((typeInfo, typeIndex) => (
            <div key={typeIndex}>
              <p>Type: {typeInfo.type}</p>
              <p>Quantity: {typeInfo.quantity}</p>
              <p>Speed: {typeInfo.speed}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ShuttlecockDetails