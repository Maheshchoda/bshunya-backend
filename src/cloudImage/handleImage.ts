import PostImage from "./api/PostImage";

const HandleImage = async (imageId) => {
  try {
    const params = {
      imageId: imageId,
    };
    return await PostImage("http://localhost:8080/api/image", params);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default HandleImage;
