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

export default async function handleDelete({ doc }) {
  try {
    const params = {
      imageId: doc.image.id,
      operation: "delete",
    };
    await deleteImage("http://localhost:8080/api/image", params);
  } catch (error) {
    console.error("Error:", error);
  }
  return "";
}
