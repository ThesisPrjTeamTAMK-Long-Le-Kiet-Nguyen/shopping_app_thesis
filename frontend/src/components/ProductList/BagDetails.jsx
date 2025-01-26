import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchBags } from '../../services/apiService'

function BagDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bag, setBag] = useState(null)

  useEffect(() => {
    fetchBags()
      .then((data) => {
        const selectedBag = data.find((b) => b._id === id)
        setBag(selectedBag)
      })
      .catch((error) => console.error('Error fetching bag details:', error))
  }, [id])

  if (!bag) {
    return <p>Loading bag details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
      <h3>{bag.name}</h3>
      <p>Price: ${bag.price}</p>
      <p>Brand: {bag.brand}</p>
      <p>Type: {bag.type}</p>
      <p>Size: {bag.size}</p>
      {bag.colors.map((colorInfo, index) => (
        <div key={index}>
          <p>Color: {colorInfo.color}</p>
          <img
            src={colorInfo.photo}
            alt={`${bag.name} in ${colorInfo.color}`}
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

export default BagDetails