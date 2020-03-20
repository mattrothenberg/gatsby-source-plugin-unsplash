import axios from "axios";

export const fetchCollectionPhotos = async ({
  collectionId,
  clientId,
  perPage
}) => {
  const response = await axios.get(
    `https://api.unsplash.com/collections/${collectionId}/photos`,
    {
      params: {
        client_id: clientId,
        per_page: perPage
      }
    }
  );
  return response.data;
};
