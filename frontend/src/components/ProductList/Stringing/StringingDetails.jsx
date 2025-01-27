import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchStringings } from '../../../services/apiService'
import './StringingDetails.css'

const StringingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stringing, setStringing] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStringings()
        const selectedStringing = data.find((s) => s._id === id)
        setStringing(selectedStringing)
        if (selectedStringing && selectedStringing.colors.length > 0) {
          setSelectedColor(selectedStringing.colors[0]) // Default to the first color
        }
      } catch (error) {
        console.error('Error fetching stringing details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleAddToBag = () => {
    if (window.confirm(`Add ${stringing.name} (${selectedColor.color}) to your shopping bag?`)) {
      const itemToAdd = {
        _id: stringing._id,
        name: stringing.name,
        price: stringing.price,
        brand: stringing.brand,
        series: stringing.series,
        gauge: stringing.gauge,
        type: stringing.type,
        color: selectedColor.color,
        quantity: 1 // Default quantity to 1, can be adjusted as needed
      }
      console.log('Item to add to shopping bag:', itemToAdd)
      // Logic to send this object to the backend goes here
    }
  }

  if (!stringing) {
    return <p>Loading stringing details...</p>
  }

  return (
    <div className="stringing-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{stringing.name}</h3>
      <p>Price: ${stringing.price}</p>
      <p>Brand: {stringing.brand}</p>
      <p>Series: {stringing.series}</p>
      <p>Gauge: {stringing.gauge} mm</p>
      <p>Type: {stringing.type}</p>

      <div>
        <h4>Select Color:</h4>
        {stringing.colors.map((colorInfo, index) => (
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
            alt={`${stringing.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="stringing-image"
          />
        </div>
      )}

      <button onClick={handleAddToBag} className="add-to-bag-button">
        Add to Shopping Bag
      </button>
    </div>
  )
}

export default StringingDetails