import { CollectionConfig } from "payload/types";

export const Authors: CollectionConfig = {
  slug: "authors",
  auth: false,
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "bio",
      type: "richText",
    },
    {
      name: "profile_image",
      type: "upload",
      relationTo: "media",
    },
  ],
  timestamps: true,
};
