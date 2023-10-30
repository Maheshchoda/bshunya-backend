import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";
import handleImage from "../cloudImage/handleImage";

// Function to handle child images
async function handleChildImages(children, operation) {
  for (const child of children) {
    if (child.type === "upload" && child.value && child.value.id) {
      const { url: childUrl, expiration } = await handleImage(
        child.value.id,
        operation
      );
      child.value["cloud"] = {};
      child.value.cloud["url"] = childUrl;
      child.value.cloud["expiration"] = expiration;
    }
  }
}

const handleArticle: CollectionBeforeValidateHook = async ({
  data, // incoming data to update or create with
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
  originalDoc, // original document
}) => {
  if (operation === "create" || operation === "update") {
    data?.content && (data["content"] = handleRichText(data.content));
    const { url: rootUrl, expiration } = await handleImage(
      data.image,
      operation
    );

    data.cloud.url = rootUrl;
    data.cloud.expiration = expiration;

    if (data.meta.cloud) {
      const { url: metaUrl, expiration } = await handleImage(
        data.meta.image,
        operation
      );
      data.meta.cloud.url = metaUrl;
      data.meta.cloud.expiration = expiration;
    }

    // Handling images within content children
    if (data?.content?.root?.children) {
      await handleChildImages(data.content.root.children, operation);
    }
  }
  return data; // Return data to either create or update a document with
};

export default handleArticle;
