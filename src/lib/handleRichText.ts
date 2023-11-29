interface Value {
  id: string;
}

interface LinkFields {
  url: string;
  newTab: boolean;
  linkType: string;
}

interface Element {
  type: string;
  text?: string;
  format?: number;
  tag?: string;
  children?: Element[];
  listType?: string;
  value?: Value;
  relationTo?: string;
  fields?: LinkFields;
}

function processLinkElement(linkElement: Element): Element {
  const linkText = linkElement.children?.map((c) => c.text).join("") || "";
  return {
    type: "link",
    text: linkText,
    children: linkElement.children,
    fields: linkElement.fields,
  };
}

// Helper function to map content elements recursively
function mapContentElement(element: Element): Element | null {
  const { type, text, tag, children, listType, format } = element;

  switch (type) {
    case "text":
      return { type: "text", format: format, text: text || "" };
    case "heading":
    case "listitem":
    case "quote":
      const processedChildrenForSpecialTypes = children
        ?.map((child) =>
          child.type === "link"
            ? processLinkElement(child)
            : mapContentElement(child)
        )
        .filter((e) => e);
      return {
        type,
        tag: type === "heading" ? tag : undefined,
        children: processedChildrenForSpecialTypes || [],
      };
    case "paragraph":
      const processedChildrenForParagraph = children
        ?.map((child) =>
          child.type === "link"
            ? processLinkElement(child)
            : mapContentElement(child)
        )
        .filter((e) => e && e.text?.trim());
      return processedChildrenForParagraph?.length
        ? { type: "paragraph", children: processedChildrenForParagraph }
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
