import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchBags } from '../../../services/apiService'
import './BagDetails.css'

const BagDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bag, setBag] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBags()
        const selectedBag = data.find((b) => b._id === id)
        setBag(selectedBag)
        if (selectedBag && selectedBag.colors.length > 0) {
          setSelectedColor(selectedBag.colors[0]) // Default to the first color
        }
      } catch (error) {
        console.error('Error fetching bag details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleAddToBag = () => {
    if (window.confirm(`Add ${bag.name} (${selectedColor.color}) to your shopping bag?`)) {
      const itemToAdd = {
        _id: bag._id,
        name: bag.name,
        price: bag.price,
        brand: bag.brand,
        type: bag.type,
        size: bag.size,
        color: selectedColor.color,
        quantity: 1 // Default quantity to 1, can be adjusted as needed
      }
      console.log('Item to add to shopping bag:', itemToAdd)
      // Logic to send this object to the backend goes here
    }
  }

  if (!bag) {
    return <p>Loading bag details...</p>
  }

  return (
    <div className="bag-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{bag.name}</h3>
      <p>Price: ${bag.price}</p>
      <p>Brand: {bag.brand}</p>
      <p>Type: {bag.type}</p>
      <p>Size: {bag.size}</p>

      <div>
        <h4>Select Color:</h4>
        {bag.colors.map((colorInfo, index) => (
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
            alt={`${bag.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="bag-image"
          />
        </div>
      )}

      <button onClick={handleAddToBag} className="add-to-bag-button">
        Add to Shopping Bag
      </button>
    </div>
  )
}

export default BagDetails 