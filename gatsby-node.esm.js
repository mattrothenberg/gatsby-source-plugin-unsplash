import { createRemoteFileNode } from "gatsby-source-filesystem";
import { asyncForEach } from "./lib";
import { fetchCollectionPhotos } from "./api";

exports.onCreateNode = async ({
  node,
  cache,
  actions,
  store,
  createNodeId
}) => {
  let fileNode;
  const { createNode } = actions;
  if (node.internal.type === "UnsplashPhoto") {
    try {
      fileNode = await createRemoteFileNode({
        url: node.urls.regular,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        store,
        cache
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }

  if (fileNode) {
    node.localImage___NODE = fileNode.id;
  }
};

exports.sourceNodes = async (
  { actions, createContentDigest },
  { collectionId, clientId, perPage }
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
        mediaType: "application/json",
        content: nodeContent,
        contentDigest: createContentDigest(photo)
      }
    };
    const node = Object.assign({}, photo, nodeMeta);
    createNode(node);
  };

  const photos = await fetchCollectionPhotos({
    collectionId,
    clientId,
    perPage
  });
  asyncForEach(photos, processPhoto);

  return;
};
