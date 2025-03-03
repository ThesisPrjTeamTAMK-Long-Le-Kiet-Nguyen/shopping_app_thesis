import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../../services/productService'
import cartService from '../../../services/cartService'
import '../index.css'

const ShuttlecockDetails = () => {
  const { id } = useParams()
  const [shuttlecock, setShuttlecock] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShuttlecocks()
        const selectedShuttlecock = data.find((s) => s.id === id)
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

  const handleAddToBag = async () => {
    if (selectedType.quantity > 0) {
      if (window.confirm(`Add ${shuttlecock.name} (${selectedColor.color}, ${selectedType.type}) to your shopping bag?`)) {
        const itemToAdd = {
          id: shuttlecock.id,
          name: shuttlecock.name,
          price: shuttlecock.price,
          color: selectedColor.color,
          type: selectedType.type,
          quantity: 1 // Default quantity to 1, can be adjusted as needed
        }
        console.log('Item to add to shopping bag:', itemToAdd)

        try {
          const response = await cartService.addToCart(itemToAdd)
          alert('Item added to cart successfully!')
          console.log('Response from cart service:', response)
        } catch (error) {
          console.error('Failed to add item to cart:', error)
          alert('Failed to add item to cart. Please try again.')
        }
      }
    } else {
      alert('This item is out of stock and cannot be added to the shopping bag.')
    }
  }

  if (!shuttlecock) {
    return <p>Loading shuttlecock details...</p>
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-column">
          <img
            src={selectedColor.photo}
            alt={`${shuttlecock.name} in ${selectedColor.color}`}
            className="product-image"
          />
        </div>
        <div className="product-info-column">
          <h3>{shuttlecock.name}</h3>
          <p className="price-tag">${shuttlecock.price}</p>
          <div>
            <h4>Select Color:</h4>
            <div className="color-options">
              {shuttlecock.colors.map((colorInfo, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleColorChange(colorInfo)}
                    className={`color-button ${selectedColor === colorInfo ? 'selected' : ''}`}
                    disabled={colorInfo.types.every(type => type.quantity === 0)} // Disable if all types are out of stock
                  >
                    {colorInfo.color}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedColor && (
            <div>
              <h4>Select Type:</h4>
              <div className="type-options">
                {selectedColor.types.map((typeInfo, typeIndex) => (
                  <div key={typeIndex}>
                    <button
                      onClick={() => handleTypeChange(typeInfo)}
                      className={`type-button ${selectedType === typeInfo ? 'selected' : ''}`}
                      disabled={typeInfo.quantity === 0} // Disable if out of stock
                    >
                      {typeInfo.type}
                    </button>
                  </div>
                ))}
              </div>
              <p>
                {selectedColor.types.every(type => type.quantity === 0) ? 'Out of stock' : 'Still in stock'}
              </p>
            </div>
          )}

          <button onClick={handleAddToBag} className="add-to-bag-button" disabled={selectedType.quantity === 0}>
            Add to Shopping Bag
          </button>
        </div>
        <div className="product-properties-column">
          <h4>Details:</h4>
          <p>Brand: {shuttlecock.brand}</p>
          <p>Feather Type: {shuttlecock.featherType}</p>
          <p>Units Per Tube: {shuttlecock.unitsPerTube}</p>
        </div>
      </div>
    </div>
  )
}

export default ShuttlecockDetails