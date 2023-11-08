import { CollectionBeforeChangeHook } from "payload/types";
import HandleRichText from "./HandleRichText";

const HandleArticle: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  data.content = HandleRichText(data.content);
  return data;
};

export default HandleArticle;
