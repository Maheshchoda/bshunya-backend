import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";

const handleArticle: CollectionBeforeValidateHook = async ({
  data, // incoming data to update or create with
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
  originalDoc, // original document
}) => {
  if (operation === "create" || operation === "update") {
    data?.content && (data["content"] = handleRichText(data.content));
  }

  return data; // Return data to either create or update a document with
};

export default handleArticle;
