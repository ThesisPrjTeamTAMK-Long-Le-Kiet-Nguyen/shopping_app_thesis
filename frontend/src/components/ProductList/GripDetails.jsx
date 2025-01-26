import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchGrips } from '../../services/apiService'

function GripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grip, setGrip] = useState(null)

  useEffect(() => {
    fetchGrips()
      .then((data) => {
        const selectedGrip = data.find((g) => g._id === id)
        setGrip(selectedGrip)
      })
      .catch((error) => console.error('Error fetching grip details:', error))
  }, [id])

  if (!grip) {
    return <p>Loading grip details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
      <h3>{grip.name}</h3>
      <p>Price: ${grip.price}</p>
      <p>Brand: {grip.brand}</p>
      <p>Thickness: {grip.thickness} mm</p>
      <p>Length: {grip.length} m</p>
      {grip.colors.map((colorInfo, index) => (
        <div key={index}>
          <p>Color: {colorInfo.color}</p>
          <img
            src={colorInfo.photo}
            alt={`${grip.name} in ${colorInfo.color}`}
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

export default GripDetails