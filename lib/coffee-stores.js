import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 10,
  });
  const unsplashResults = photos.response.results ; 
  return unsplashResults.map(result => result.urls['small'])
}

export const fetchCoffeeStores = async () => {

  const photos = await getListOfCoffeeStorePhotos();

    const response = await fetch('https://api.foursquare.com/v3/places/nearby?ll=43.65267326999575,-79.39545615725015&query=coffee stores&v=20220105&limit=8', {
    "headers": {
      'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  })
  const data = await response.json();
   
  return data?.results?.map((venue, idx) => { // <------
    const neighbourhood = venue.location.neighborhood;
    return {
      id: venue.fsq_id, // <------
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood: (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) || venue.location.cross_street || "",
      imgUrl: photos[idx],
    };
  }) || [];
}