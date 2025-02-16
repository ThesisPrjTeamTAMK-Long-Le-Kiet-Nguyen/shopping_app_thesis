import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchGrips } from '../../../services/productService'
import cartService from '../../../services/cartService'
import '../index.css'

const GripDetails = () => {
  const { id } = useParams()
  const [grip, setGrip] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGrips()
        const selectedGrip = data.find((g) => g.id === id)
        setGrip(selectedGrip)
        if (selectedGrip && selectedGrip.colors.length > 0) {
          const defaultColor = selectedGrip.colors[0]
          setSelectedColor(defaultColor)
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

  const handleAddToBag = async () => {
    if (selectedColor.quantity > 0) {
      if (window.confirm(`Add ${grip.name} (${selectedColor.color}) to your shopping bag?`)) {
        const itemToAdd = {
          id: grip.id,
          name: grip.name,
          price: grip.price,
          color: selectedColor.color,
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

  if (!grip) {
    return <p>Loading grip details...</p>
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-column">
          <img
            src={selectedColor.photo}
            alt={`${grip.name} in ${selectedColor.color}`}
            className="product-image"
          />
        </div>
        <div className="product-info-column">
          <h3>{grip.name}</h3>
          <p className="price-tag">${grip.price}</p>
          <div>
            <h4>Select Color:</h4>
            <div className="color-options">
              {grip.colors.map((colorInfo, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleColorChange(colorInfo)}
                    className={`color-button ${selectedColor === colorInfo ? 'selected' : ''}`}
                    disabled={colorInfo.quantity === 0} // Disable if out of stock
                  >
                    {colorInfo.color}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleAddToBag} className="add-to-bag-button" disabled={selectedColor.quantity === 0}>
            Add to Shopping Bag
          </button>
        </div>
        <div className="product-properties-column">
          <h4>Details:</h4>
          <p>Brand: {grip.brand}</p>
          <p>Thickness: {grip.thickness} mm</p>
          <p>Length: {grip.length} m</p>
        </div>
      </div>
    </div>
  )
}

export default GripDetails