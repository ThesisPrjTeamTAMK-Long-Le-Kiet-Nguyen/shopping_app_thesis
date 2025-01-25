export async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function fetchRackets() {
  try {
    const response = await fetch('http://localhost:3000/products/rackets');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch rackets:', error);
    throw error;
  }
}