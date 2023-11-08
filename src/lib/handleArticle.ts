import { CollectionBeforeChangeHook } from "payload/types";
import HandleRichText from "./HandleRichText";
import HandleImage from "../cloudImage/HandleImage";
import { deleteFromCloud } from "../cloudImage/api/DeleteImage";

async function handleImageForData(data, originalData = null) {
  if (data.image && (!originalData || data.image !== originalData.image)) {
    const { url: imageUrl, expiration } = await HandleImage(data.image);
    data["cloud"] = {
      url: imageUrl,
      expiration: expiration,
    };
    if (originalData) {
      await deleteFromCloud(originalData.image);
    }
  }
}

async function handleImageForMeta(data, originalMeta = null) {
  if (
    data.meta?.image &&
    (!originalMeta || data.meta.image !== originalMeta.meta?.image)
  ) {
    const { url: metaImageUrl, expiration } = await HandleImage(
      data.meta.image
    );
    data.meta["cloud"] = {
      url: metaImageUrl,
      expiration: expiration,
    };

    if (originalMeta) {
      await deleteFromCloud(originalMeta.meta.image);
    }
  }
}

async function handleImagesForContentChildren(data, originalChildren = null) {
  const children = data.content.root.children;

  await Promise.all(
    children.map(async (child) => {
      if (child.type === "upload" && child.value?.id) {
        const existingChild = originalChildren?.find(
          (originalChild) => originalChild.value?.id === child.value?.id
        );
        if (!existingChild) {
          const { url: childUrl, expiration } = await HandleImage(
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

  if (originalChildren) {
    originalChildren.forEach(async (originalChild) => {
      if (
        !children.find((child) => child.value?.id === originalChild.value?.id)
      ) {
        await deleteFromCloud(originalChild.value.id);
      }
    });
  }
}

const HandleArticle: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  data.content = HandleRichText(data.content);
  // if (operation === "create") {
  //   await Promise.all([
  //     handleImageForData(data),
  //     handleImageForMeta(data),
  //     handleImagesForContentChildren(data),
  //   ]);
  // } else if (operation === "update") {
  //   await Promise.all([
  //     handleImageForData(data, originalDoc),
  //     handleImageForMeta(data, originalDoc),
  //     handleImagesForContentChildren(
  //       data,
  //       originalDoc?.content?.root?.children
  //     ),
  //   ]);
  // }

  return data;
};

export default HandleArticle;
