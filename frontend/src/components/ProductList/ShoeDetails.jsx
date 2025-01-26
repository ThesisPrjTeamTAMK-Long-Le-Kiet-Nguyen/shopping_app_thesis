import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShoes } from '../../services/apiService'

function ShoeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shoe, setShoe] = useState(null)

  useEffect(() => {
    fetchShoes()
      .then((data) => {
        const selectedShoe = data.find((s) => s._id === id)
        setShoe(selectedShoe)
      })
      .catch((error) => console.error('Error fetching shoe details:', error))
  }, [id])

  if (!shoe) {
    return <p>Loading shoe details...</p>
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>Back to List</button>
      <h3>{shoe.name}</h3>
      <p>Price: ${shoe.price}</p>
      <p>Brand: {shoe.brand}</p>
      <p>Series: {shoe.series}</p>
      <p>Midsole: {shoe.midsole}</p>
      <p>Outsole: {shoe.outsole}</p>
      {shoe.colors.map((colorInfo, index) => (
        <div key={index}>
          <p>Color: {colorInfo.color}</p>
          <img
            src={colorInfo.photo}
            alt={`${shoe.name} in ${colorInfo.color}`}
            width="200"
            height="auto"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
          {colorInfo.types.map((typeInfo, typeIndex) => (
            <div key={typeIndex}>
              <p>Size: {typeInfo.size}</p>
              <p>Quantity: {typeInfo.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ShoeDetails