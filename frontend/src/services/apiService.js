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

export async function fetchShoes() {
  try {
    const response = await fetch('http://localhost:3000/products/shoes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch shoes:', error);
    throw error;
  }
}

export async function fetchStringings() {
  try {
    const response = await fetch('http://localhost:3000/products/stringings');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch stringings:', error);
    throw error;
  }
}

export async function fetchShuttlecocks() {
  try {
    const response = await fetch('http://localhost:3000/products/shuttlecocks');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch shuttlecocks:', error);
    throw error;
  }
}

export async function fetchGrips() {
  try {
    const response = await fetch('http://localhost:3000/products/grips');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch grips:', error);
    throw error;
  }
}

export async function fetchBags() {
  try {
    const response = await fetch('http://localhost:3000/products/bags');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch bags:', error);
    throw error;
  }
}