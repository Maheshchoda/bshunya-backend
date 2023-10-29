import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";
import handleImage from "../cloudImage/handleImage";

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
      for (const child of data.content.root.children) {
        if (child.type === "upload" && child.value && child.value.id) {
          await handleImage(child.value.id, operation); // Passing image data to handleImage
        }
      }
    }
  }
  return data; // Return data to either create or update a document with
};

export default handleArticle;
