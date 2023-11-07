interface Value {
  id: string;
}

interface Element {
  type: string;
  text?: string;
  tag?: string;
  children?: Element[];
  listType?: string;
  value?: Value;
  relationTo?: string;
}

// Helper function to map content elements recursively
function mapContentElement(element: Element): Element | null {
  const { type, text, tag, children, listType } = element;

  switch (type) {
    case "text":
      return { type: "text", text: text || "" };
    case "heading":
    case "listitem":
    case "quote":
      return {
        type,
        tag: type === "heading" ? tag : undefined,
        children: children?.map(mapContentElement).filter((e) => e) || [],
      };
    case "paragraph":
      const filteredChildren = children
        ?.filter((c) => c.text?.trim())
        .map(mapContentElement)
        .filter((e) => e);
      return filteredChildren?.length
        ? { type: "paragraph", children: filteredChildren }
        : null;
    case "list":
      return {
        type: "list",
        listType: listType === "number" ? "number" : "bullet",
        children: children?.map(mapContentElement).filter((e) => e) || [],
      };
    case "upload":
      return {
        type: "upload",
        relationTo: "media",
        value: {
          id: element.value?.id || "",
        },
      };
    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}

// Function to process the article and filter out unwanted elements
export default function HandleRichText(obj: {
  root?: { children?: Element[] };
}) {
  if (!obj.root || !obj.root.children) {
    throw new Error("Invalid input object");
  }

  const newChildren = obj.root.children.map(mapContentElement).filter((e) => e);
  const newRoot = { type: "root", children: newChildren, direction: "ltr" };

  return { root: newRoot };
}
