import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";

const handleArticle: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation === "create" || operation === "update") {
    data?.content && (data["content"] = handleRichText(data.content));
  }

  return data; // Return data to either create or update a document with
};

export default handleArticle;
