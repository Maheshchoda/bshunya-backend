import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";
import handleImage from "../cloudImage/handleImage";

async function handleImageForData(data) {
  if (data.image) {
    const { url: imageUrl, expiration } = await handleImage(data.image);
    data["cloud"] = {
      url: imageUrl,
      expiration: expiration,
    };
  }
}

async function handleImageForMeta(data) {
  if (data.meta && data.meta.image) {
    const { url: metaImageUrl, expiration } = await handleImage(
      data.meta.image
    );
    data.meta["cloud"] = {
      url: metaImageUrl,
      expiration: expiration,
    };
  }
}

async function handleImagesForContentChildren(data, originalChildren = null) {
  if (data.content && data.content.root && data.content.root.children) {
    const children = data.content.root.children;
    await Promise.all(
      children.map(async (child, index) => {
        if (child.type === "upload" && child.value?.id) {
          if (
            !originalChildren ||
            !originalChildren[index] ||
            child.value.id !== originalChildren[index]?.value?.id
          ) {
            const { url: childUrl, expiration } = await handleImage(
              child.value.id
            );
            child.value["cloud"] = {
              url: childUrl,
              expiration: expiration,
            };
          }
        }
      })
    );
  }
}

const handleArticle: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  data.content = handleRichText(data.content);

  if (operation === "create") {
    await Promise.all([handleImageForData(data), handleImageForMeta(data)]);
    await handleImagesForContentChildren(data);
  } else if (operation === "update") {
    if (data.image !== originalDoc.image) {
      await handleImageForData(data);
    }

    if (data.meta && data.meta.image !== originalDoc.meta.image) {
      await handleImageForMeta(data);
    }

    if (data?.content?.root?.children && originalDoc?.content?.root?.children) {
      await handleImagesForContentChildren(
        data,
        originalDoc.content.root.children
      );
    }
  }

  return data;
};

export default handleArticle;
