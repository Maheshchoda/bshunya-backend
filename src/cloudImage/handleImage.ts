import postImage from "./api/postImage";

const handleImage = async (imageId, operation) => {
  try {
    const params = {
      imageId: imageId,
      operation: operation,
    };
    return await postImage("http://localhost:8080/api/image", params);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default handleImage;
