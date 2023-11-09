import { CollectionConfig } from "payload/types";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      hooks: {
        beforeValidate: [(data) => data.value.toLowerCase()],
      },
      required: true,
    },
    {
      name: "description",
      type: "richText",
    },
  ],
  timestamps: true,
};
