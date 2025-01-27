import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchRackets } from '../../../services/apiService'
import './RacketDetails.css'

const RacketDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [racket, setRacket] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRackets()
        const selectedRacket = data.find((r) => r._id === id)
        setRacket(selectedRacket)
        if (selectedRacket && selectedRacket.colors.length > 0) {
          const defaultColor = selectedRacket.colors[0]
          setSelectedColor(defaultColor)
          const defaultType = defaultColor.types.find(type => type.type === "4ug5") || defaultColor.types[0]
          setSelectedType(defaultType)
        }
      } catch (error) {
        console.error('Error fetching racket details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
    const defaultType = color.types.find(type => type.type === "4ug5") || color.types[0]
    setSelectedType(defaultType)
  }

  const handleTypeChange = (type) => {
    setSelectedType(type)
  }

  const handleAddToBag = () => {
    if (window.confirm(`Add ${racket.name} (${selectedColor.color}, ${selectedType.type}) to your shopping bag?`)) {
      const itemToAdd = {
        _id: racket._id,
        name: racket.name,
        price: racket.price,
        brand: racket.brand,
        series: racket.series,
        racketType: racket.racketType,
        flexibility: racket.flexibility,
        material: racket.material,
        balancePoint: racket.balancePoint,
        cover: racket.cover,
        color: selectedColor.color,
        type: selectedType.type,
        maxTension: selectedType.maxTension,
        quantity: 1 // Default quantity to 1, can be adjusted as needed
      }
      console.log('Item to add to shopping bag:', itemToAdd)
      // Logic to send this object to the backend goes here
    }
  }

  if (!racket) {
    return <p>Loading racket details...</p>
  }

  return (
    <div className="racket-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{racket.name}</h3>
      <p>Price: ${racket.price}</p>
      <p>Brand: {racket.brand}</p>
      <p>Series: {racket.series}</p>
      <p>Type: {racket.racketType}</p>
      <p>Flexibility: {racket.flexibility}</p>
      <p>Material: {racket.material}</p>
      <p>Balance Point: {racket.balancePoint} mm</p>
      <p>Cover: {racket.cover ? 'Yes' : 'No'}</p>

      <div>
        <h4>Select Color:</h4>
        {racket.colors.map((colorInfo, index) => (
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
            alt={`${racket.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="racket-image"
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

export default RacketDetails