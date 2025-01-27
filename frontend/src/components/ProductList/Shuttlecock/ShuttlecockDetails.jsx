import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../../services/apiService'
import './ShuttlecockDetails.css'

const ShuttlecockDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shuttlecock, setShuttlecock] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShuttlecocks()
        const selectedShuttlecock = data.find((s) => s._id === id)
        setShuttlecock(selectedShuttlecock)
        if (selectedShuttlecock && selectedShuttlecock.colors.length > 0) {
          const defaultColor = selectedShuttlecock.colors[0]
          setSelectedColor(defaultColor)
          const defaultType = defaultColor.types[0]
          setSelectedType(defaultType)
        }
      } catch (error) {
        console.error('Error fetching shuttlecock details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
    const defaultType = color.types[0]
    setSelectedType(defaultType)
  }

  const handleTypeChange = (type) => {
    setSelectedType(type)
  }

  const handleAddToBag = () => {
    if (window.confirm(`Add ${shuttlecock.name} (${selectedColor.color}, ${selectedType.type}) to your shopping bag?`)) {
      const itemToAdd = {
        _id: shuttlecock._id,
        name: shuttlecock.name,
        price: shuttlecock.price,
        brand: shuttlecock.brand,
        featherType: shuttlecock.featherType,
        unitsPerTube: shuttlecock.unitsPerTube,
        color: selectedColor.color,
        type: selectedType.type,
        speed: selectedType.speed,
        quantity: 1 // Default quantity to 1, can be adjusted as needed
      }
      console.log('Item to add to shopping bag:', itemToAdd)
      // Logic to send this object to the backend goes here
    }
  }

  if (!shuttlecock) {
    return <p>Loading shuttlecock details...</p>
  }

  return (
    <div className="shuttlecock-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{shuttlecock.name}</h3>
      <p>Price: ${shuttlecock.price}</p>
      <p>Brand: {shuttlecock.brand}</p>
      <p>Feather Type: {shuttlecock.featherType}</p>
      <p>Units Per Tube: {shuttlecock.unitsPerTube}</p>

      <div>
        <h4>Select Color:</h4>
        {shuttlecock.colors.map((colorInfo, index) => (
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
            alt={`${shuttlecock.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="shuttlecock-image"
          />
          <h4>Select Type:</h4>
          {selectedColor.types.map((typeInfo, typeIndex) => (
            <button
              key={typeIndex}
              onClick={() => handleTypeChange(typeInfo)}
              className={`type-button ${selectedType === typeInfo ? 'selected' : ''}`}
            >
              {typeInfo.type}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleAddToBag} className="add-to-bag-button">
        Add to Shopping Bag
      </button>
    </div>
  )
}

export default ShuttlecockDetails