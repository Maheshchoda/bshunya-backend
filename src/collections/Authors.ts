import { CollectionConfig } from "payload/types";
import RichTextField from "../fieldFilter/RichTextField";

export const Authors: CollectionConfig = {
  slug: "authors",
  auth: false,
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    beforeValidate: [
      (form) => {
        form.data?.bio && (form.data["bio"] = RichTextField(form.data.bio));
      },
    ],
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
