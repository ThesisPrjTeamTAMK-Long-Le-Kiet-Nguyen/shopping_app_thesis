import { useState, useEffect } from 'react'
import { fetchData } from './services/apiService' // Import the fetchData function

function App() {
  const [data, setData] = useState(null) // State to hold fetched data

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData()
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <div>
      <h1>Fetched Data:</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  )
}

export default App
