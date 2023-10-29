import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";
import handleImage from "../cloudImage/handleImage";

// Function to handle child images
async function handleChildImages(children, operation) {
  for (const child of children) {
    if (child.type === "upload" && child.value && child.value.id) {
      await handleImage(child.value.id, operation);
    }
  }
}

const handleArticle: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation === "create" || operation === "update") {
    data?.content && (data["content"] = handleRichText(data.content));
    await handleImage(data.image, operation);

    // Handling images within content children
    if (data?.content?.root?.children) {
      await handleChildImages(data.content.root.children, operation);
    }
  }
  return data; // Return data to either create or update a document with
};

export default handleArticle;
