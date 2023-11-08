import { CollectionAfterChangeHook } from "payload/types";
import HandleImage from "../cloudImage/HandleImage";
import payload from "payload";

const testHandleImage: CollectionAfterChangeHook = async ({
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
      console.log(doc, "From the doc");
      await payload.update({
        collection: "media",
        id: doc.id,
        data: doc,
        overwriteExistingFiles: true, // if you're handling file uploads
      });
    }
  } catch (error) {
    console.log(error);
  }
  // await HandleImage(doc.id);
};

export default testHandleImage;
