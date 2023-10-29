async function deleteImage(url, params) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return { status: "success", message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { status: "error", message: error.message };
  }
}

// Function to delete child images
async function deleteChildImages(children) {
  for (const child of children) {
    if (child.type === "upload" && child.value && child.value.id) {
      const params = {
        imageId: child.value.id, // Fixed: use child.value.id instead of doc.image.id
        operation: "delete",
      };
      await deleteImage("http://localhost:8080/api/image", params);
    }
  }
}

export default async function handleDelete({ doc }) {
  try {
    const params = {
      imageId: doc.image.id,
      operation: "delete",
    };
    await deleteImage("http://localhost:8080/api/image", params);

    // Call deleteChildImages if there are children to delete
    if (doc?.content?.root?.children) {
      await deleteChildImages(doc.content.root.children);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return "";
}
