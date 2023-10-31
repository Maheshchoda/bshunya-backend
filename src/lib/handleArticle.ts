import { CollectionBeforeValidateHook } from "payload/types";
import handleRichText from "./handleRichText";
import handleImage from "../cloudImage/handleImage";
import { deleteFromCloud } from "../cloudImage/api/deleteImage";

async function handleImageForData(data, originalData = null) {
  if (data.image && (!originalData || data.image !== originalData.image)) {
    await handleImage(data.image);
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
    await handleImage(data.meta.image);
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
          await handleImage(child.value.id);
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

const testHandleArticle: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  data.content = handleRichText(data.content);

  if (operation === "create") {
    await Promise.all([
      handleImageForData(data),
      handleImageForMeta(data),
      handleImagesForContentChildren(data),
    ]);
  } else if (operation === "update") {
    await Promise.all([
      handleImageForData(data, originalDoc),
      handleImageForMeta(data, originalDoc),
      handleImagesForContentChildren(
        data,
        originalDoc?.content?.root?.children
      ),
    ]);
  }

  return data;
};

export default testHandleArticle;
