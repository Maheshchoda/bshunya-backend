import { CollectionAfterChangeHook } from "payload/types";
import PostData from "./PostData";

async function fetchAndStoreArticle(articleId) {
  try {
    //   Replace with the actual API endpoint
    const apiEndpoint = `http://localhost:4000/api/articles/${articleId}?locale=undefined&draft=false&depth=1`;

    const apiKey = "b5f791a5-33bd-4933-a441-73757cee8579"; // The API key assigned to the user
    const response = await fetch(apiEndpoint, {
      headers: {
        Authorization: `users API-Key ${apiKey}`,
      },
    });

    const article = await response.json();

    const params = {
      article: article,
    };
    await PostData("http://localhost:8080/api/article", params);
  } catch (error) {
    console.error("Error fetching and storing complete article data:", error);
  }
}

const StoreArticleSnapshot: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}) => {
  await fetchAndStoreArticle(doc.id);
  return doc;
};

export default StoreArticleSnapshot;
