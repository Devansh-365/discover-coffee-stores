export const fetchCoffeeStores = async () => {
    const response = await fetch('https://api.foursquare.com/v3/places/nearby?ll=43.65267326999575,-79.39545615725015&query=coffee stores&v=20220105&limit=8', {
    "headers": {
      'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  })
  const data = await response.json();
   
  const transformedData = data?.results?.map((venue) => {
      return {
          id: venue.fsq_id,
          ...venue
      }}) || [];
   
  return transformedData
}