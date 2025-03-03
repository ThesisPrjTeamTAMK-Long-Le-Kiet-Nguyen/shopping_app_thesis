import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchBags } from '../../../services/productService'
import cartService from '../../../services/cartService'
import '../index.css'

const BagDetails = () => {
  const { id } = useParams()
  const [bag, setBag] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBags()
        const selectedBag = data.find((b) => b.id === id)
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

  const handleAddToBag = async () => {
    if (selectedColor.quantity > 0) {
      if (window.confirm(`Add ${bag.name} (${selectedColor.color}) to your shopping bag?`)) {
        const itemToAdd = {
          id: bag.id,
          name: bag.name,
          price: bag.price,
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

  if (!bag) {
    return <p>Loading bag details...</p>
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-column">
          <img
            src={selectedColor.photo}
            alt={`${bag.name} in ${selectedColor.color}`}
            className="product-image"
          />
        </div>
        <div className="product-info-column">
          <h3>{bag.name}</h3>
          <p className="price-tag">${bag.price}</p>
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
                disabled={colorInfo.quantity === 0} // Disable if out of stock
              >
                {colorInfo.color}
              </button>
            ))}
          </div>

          <button onClick={handleAddToBag} className="add-to-bag-button" disabled={selectedColor.quantity === 0}>
            Add to Shopping Bag
          </button>
        </div>
        <div className="product-properties-column">
          <h4>Details:</h4>
          <p>Brand: {bag.brand}</p>
          <p>Type: {bag.type}</p>
          <p>Size: {bag.size}</p>
        </div>
      </div>
    </div>
  )
}

export default BagDetails