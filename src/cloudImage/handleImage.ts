import postImage from "./api/postImage";

const handleImage = async (data, operation) => {
  try {
    const params = {
      imageId: data.image,
      operation: operation,
    };
    if (operation === "create" || operation === "update") {
      await postImage("http://localhost:8080/api/image", params);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return "";
};

export default handleImage;
