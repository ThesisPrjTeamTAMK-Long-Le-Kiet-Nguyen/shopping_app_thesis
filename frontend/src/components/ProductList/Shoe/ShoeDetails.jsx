import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchShoes } from '../../../services/apiService'
import './ShoeDetails.css'

const ShoeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shoe, setShoe] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShoes()
        const selectedShoe = data.find((s) => s._id === id)
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
  }

  if (!shoe) {
    return <p>Loading shoe details...</p>
  }

  return (
    <div className="shoe-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to List</button>
      <h3>{shoe.name}</h3>
      <p>Price: ${shoe.price}</p>
      <p>Brand: {shoe.brand}</p>
      <p>Series: {shoe.series}</p>
      <p>Midsole: {shoe.midsole}</p>
      <p>Outsole: {shoe.outsole}</p>

      <div>
        <h4>Select Color:</h4>
        {shoe.colors.map((colorInfo, index) => (
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
            alt={`${shoe.name} in ${selectedColor.color}`}
            width="200"
            height="auto"
            className="shoe-image"
          />
          <h4>Select Size:</h4>
          {selectedColor.types.map((typeInfo, typeIndex) => (
            <button
              key={typeIndex}
              onClick={() => handleSizeChange(typeInfo)}
              className={`size-button ${selectedSize === typeInfo ? 'selected' : ''}`}
            >
              {typeInfo.size}
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

export default ShoeDetails