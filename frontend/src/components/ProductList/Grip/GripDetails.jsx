import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchGrips } from '../../../services/apiService'
import './GripDetails.css'

const GripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grip, setGrip] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGrips()
        const selectedGrip = data.find((g) => g._id === id)
        setGrip(selectedGrip)
        if (selectedGrip && selectedGrip.colors.length > 0) {
          setSelectedColor(selectedGrip.colors[0]) // Default to the first color
        }
      } catch (error) {
        console.error('Error fetching grip details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleAddToBag = () => {
    if (window.confirm(`Add ${grip.name} (${selectedColor.color}) to your shopping bag?`)) {
      const itemToAdd = {
        _id: grip._id,
        name: grip.name,
        price: grip.price,
        brand: grip.brand,
        thickness: grip.thickness,
        length: grip.length,
        color: selectedColor.color,
        quantity: 1 // Default quantity to 1, can be adjusted as needed
      }
      console.log('Item to add to shopping bag:', itemToAdd)
      // Logic to send this object to the backend goes here
    }
  }

  if (!grip) {
    return <p>Loading grip details...</p>
  }

  return (
    <div className="grip-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{grip.name}</h3>
      <p>Price: ${grip.price}</p>
      <p>Brand: {grip.brand}</p>
      <p>Thickness: {grip.thickness} mm</p>
      <p>Length: {grip.length} m</p>

      <div>
        <h4>Select Color:</h4>
        {grip.colors.map((colorInfo, index) => (
          <button
            key={index}
            onClick={() => handleColorChange(colorInfo)}
            className={`color-button ${selectedColor === colorInfo ? 'selected' : ''}`}
          >
            {colorInfo.color}
          </button>
        ))}
      </div>

      {selectedColor && (
        <div>
          <img
            src={selectedColor.photo}
            alt={`${grip.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="grip-image"
          />
        </div>
      )}

      <button onClick={handleAddToBag} className="add-to-bag-button">
        Add to Shopping Bag
      </button>
    </div>
  )
}

export default GripDetails