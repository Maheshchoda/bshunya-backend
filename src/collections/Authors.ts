import { CollectionConfig } from "payload/types";
import handleAuthor from "../lib/HandleAuthor";

export const Authors: CollectionConfig = {
  slug: "authors",
  auth: false,
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    beforeValidate: [handleAuthor],
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
