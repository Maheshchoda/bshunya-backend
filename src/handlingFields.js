function mapContentElement(element) {
  switch (element.type) {
    case "text":
      return { type: "text", text: element.text };
    case "heading":
      return {
        type: "heading",
        tag: element.tag,
        children: element.children.map(mapContentElement),
      };
    case "paragraph":
      // If all children have empty text, don't include this paragraph
      if (element.children.every((child) => child.text?.trim() === "")) {
        return null;
      }
      return {
        type: "paragraph",
        children: element.children.map(mapContentElement),
      };
    case "listitem":
      return {
        type: "listitem",
        children: element.children.map(mapContentElement),
      };
    case "list":
      return {
        type: "list",
        listType: element.listType === "number" ? "number" : "bullet",
        children: element.children.map(mapContentElement),
      };
    case "quote":
      return {
        type: "quote",
        children: element.children.map(mapContentElement),
      };
    case "upload":
      return {
        type: "upload",
        relationTo: "media",
        value: {
          id: element.value.id,
        },
      };
    default:
      return null;
  }
}

export default function extractNecessaryProperties(obj) {
  const newChildren = obj.root.children.map(mapContentElement).filter(Boolean);
  const newRoot = { type: "root", children: newChildren, direction: "ltr" };
  return { root: newRoot };
}

// const newObject = extractNecessaryProperties(originalObject);
// console.log(newObject);
