import axios from "axios";

export const fetchCollectionPhotos = async ({ collectionId, clientId }) => {
  const response = await axios.get(
    `https://api.unsplash.com/collections/${collectionId}/photos`,
    {
      params: {
        client_id: clientId
      }
    }
  );
  return response.data;
};
