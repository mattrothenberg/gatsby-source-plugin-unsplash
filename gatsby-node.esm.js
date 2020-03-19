import { createRemoteFileNode } from "gatsby-source-filesystem";
import { asyncForEach } from "./lib";
import { fetchCollectionPhotos } from "./api";

exports.sourceNodes = async (
  { actions, createNodeId, store, cache, createContentDigest },
  { collectionId, clientId }
) => {
  const { createNode } = actions;

  if (!collectionId) {
    console.warn("No collection ID provided, so no nodes will be generated.");
  }

  if (!clientId) {
    console.warn(
      "No client ID provided, so no photos can be fetched from Unsplash's API."
    );
  }

  const processPhoto = async photo => {
    const nodeContent = JSON.stringify(photo);
    const nodeMeta = {
      id: photo.id,
      parent: null,
      children: [],
      internal: {
        type: `UnsplashPhoto`,
        mediaType: `text/json`,
        content: nodeContent,
        contentDigest: createContentDigest(photo)
      }
    };
    const node = Object.assign({}, photo, nodeMeta);

    const fileNode = await createRemoteFileNode({
      url: photo.urls.regular,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      store,
      cache
    });

    if (fileNode) {
      node.localFile___NODE = fileNode.id;
    }

    createNode(node);
  };

  const photos = await fetchCollectionPhotos({ collectionId, clientId });
  asyncForEach(photos, processPhoto);

  return;
};
