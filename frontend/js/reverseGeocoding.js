async function reverseGeocoding(latitude, longitude) {
  try {
    const response = await fetch(`http://localhost:3000/nominatim-reverse?lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    
    if (data && data.address) {
      return data.address;
    } else {
      console.error('No address found for the given coordinates.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching address from Nominatim:', error);
    return null;
  }
}