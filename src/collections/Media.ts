import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import type { CollectionConfig } from "payload/types";
import testHandleImage from "./testHandleImage";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(__dirname, "../../../media"),
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [testHandleImage],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "richText",
      editor: slateEditor({
        admin: {
          elements: ["link"],
        },
      }),
    },
    {
      name: "cloud",
      type: "group",
      fields: [
        {
          name: "url",
          type: "text",
        },
        {
          name: "expiration",
          type: "text",
        },
      ],
    },
  ],
};
