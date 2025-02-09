import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchStringings } from '../../../services/apiService'
import '../index.css'

const StringingDetails = () => {
  const { id } = useParams()
  const [stringing, setStringing] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStringings()
        const selectedStringing = data.find((s) => s.id === id)
        setStringing(selectedStringing)
        if (selectedStringing && selectedStringing.colors.length > 0) {
          const defaultColor = selectedStringing.colors[0]
          setSelectedColor(defaultColor)
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
    if (selectedColor.quantity > 0) {
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
    } else {
      alert('This item is out of stock and cannot be added to the shopping bag.');
    }
  }

  if (!stringing) {
    return <p>Loading stringing details...</p>
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-column">
          <img
            src={selectedColor.photo}
            alt={`${stringing.name} in ${selectedColor.color}`}
            className="product-image"
          />
        </div>
        <div className="product-info-column">
          <h3>{stringing.name}</h3>
          <p className="price-tag">${stringing.price}</p>
          <div>
            <h4>Select Color:</h4>
            <div className="color-options">
              {stringing.colors.map((colorInfo, index) => (
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
          <p>Brand: {stringing.brand}</p>
          <p>Series: {stringing.series}</p>
          <p>Gauge: {stringing.gauge} mm</p>
          <p>Type: {stringing.type}</p>
        </div>
      </div>
    </div>
  )
}

export default StringingDetails