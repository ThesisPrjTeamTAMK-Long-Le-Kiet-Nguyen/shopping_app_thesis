import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShoes } from '../../../services/productService'
import '../index.css'

const ShoeDetails = () => {
  const { id } = useParams()
  const [shoe, setShoe] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShoes()
        const selectedShoe = data.find((s) => s.id === id)
        setShoe(selectedShoe)
        if (selectedShoe && selectedShoe.colors.length > 0) {
          const defaultColor = selectedShoe.colors[0]
          setSelectedColor(defaultColor)
          const defaultSize = defaultColor.types[0]
          setSelectedSize(defaultSize)
        }
      } catch (error) {
        console.error('Error fetching shoe details:', error)
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color) => {
    setSelectedColor(color)
    const defaultSize = color.types[0]
    setSelectedSize(defaultSize)
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size)
  }

  const handleAddToBag = () => {
    if (selectedSize.quantity > 0) {
      if (window.confirm(`Add ${shoe.name} (${selectedColor.color}, Size ${selectedSize.size}) to your shopping bag?`)) {
        const itemToAdd = {
          _id: shoe._id,
          name: shoe.name,
          price: shoe.price,
          brand: shoe.brand,
          series: shoe.series,
          midsole: shoe.midsole,
          outsole: shoe.outsole,
          color: selectedColor.color,
          size: selectedSize.size,
          quantity: 1 // Default quantity to 1, can be adjusted as needed
        }
        console.log('Item to add to shopping bag:', itemToAdd)
        // Logic to send this object to the backend goes here
      }
    } else {
      alert('This item is out of stock and cannot be added to the shopping bag.');
    }
  }

  if (!shoe) {
    return <p>Loading shoe details...</p>
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-column">
          <img
            src={selectedColor.photo}
            alt={`${shoe.name} in ${selectedColor.color}`}
            className="product-image"
          />
        </div>
        <div className="product-info-column">
          <h3>{shoe.name}</h3>
          <p className="price-tag">${shoe.price}</p>
          <div>
            <h4>Select Color:</h4>
            <div className="color-options">
              {shoe.colors.map((colorInfo, index) => (
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
              <h4>Select Size:</h4>
              <div className="size-options">
                {selectedColor.types.map((typeInfo, typeIndex) => (
                  <div key={typeIndex}>
                    <button
                      onClick={() => handleSizeChange(typeInfo)}
                      className={`size-button ${selectedSize === typeInfo ? 'selected' : ''}`}
                      disabled={typeInfo.quantity === 0} // Disable if out of stock
                    >
                      {typeInfo.size}
                    </button>
                  </div>
                ))}
              </div>
              <p>
                {selectedColor.types.every(type => type.quantity === 0) ? 'Out of stock' : 'Still in stock'}
              </p>
            </div>
          )}

          <button onClick={handleAddToBag} className="add-to-bag-button" disabled={selectedSize.quantity === 0}>
            Add to Shopping Bag
          </button>
        </div>
        <div className="product-properties-column">
          <h4>Details:</h4>
          <p>Brand: {shoe.brand}</p>
          <p>Series: {shoe.series}</p>
          <p>Midsole: {shoe.midsole}</p>
          <p>Outsole: {shoe.outsole}</p>
        </div>
      </div>
    </div>
  )
}

export default ShoeDetails