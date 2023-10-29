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
    await handleImage(data, operation);
  }

  return data; // Return data to either create or update a document with
};

export default handleArticle;
