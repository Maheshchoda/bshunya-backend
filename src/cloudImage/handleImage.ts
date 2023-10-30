import postImage from "./api/postImage";

const handleImage = async (imageId) => {
  try {
    const params = {
      imageId: imageId,
    };
    return await postImage("http://localhost:8080/api/image", params);
  } catch (error) {
    console.error("Error:", error);
  }
};

export default handleImage;
