import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./HandleRichText";

const handleAuthor: CollectionBeforeValidateHook = async ({
  data, // incoming data to update or create with
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
  originalDoc, // original document
}) => {
  if (operation === "create" || operation === "update") {
    data?.bio && (data["bio"] = handleRichText(data.bio));
  }

  return data; // Return data to either create or update a document with
};

export default handleAuthor;
