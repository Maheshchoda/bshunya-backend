import { CollectionAfterChangeHook } from "payload/types";
import HandleImage from "../cloudImage/HandleImage";
import payload from "payload";

const GetCloudURL: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}) => {
  try {
    if (operation === "create") {
      const { url: imageUrl, expiration } = await HandleImage(doc.id);
      doc["cloud"] = {
        url: imageUrl,
        expiration: expiration,
      };
      await payload.update({
        collection: "media",
        id: doc.id,
        data: doc,
        overwriteExistingFiles: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default GetCloudURL;
