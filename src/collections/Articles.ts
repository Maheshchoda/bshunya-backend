import { CollectionConfig, FieldHook } from "payload/types";

const formatSlug: FieldHook = async ({ value, data }) => {
  return data?.title?.replace(/ /g, "-").toLowerCase() ?? value;
};

export const Articles: CollectionConfig = {
  slug: "articles",
  auth: false,
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },

    {
      name: "slug",
      label: "Slug",
      type: "text",
      unique: true,
      localized: false,
      hooks: {
        beforeValidate: [formatSlug],
      },
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "authorId",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "publishedOn",
      type: "date",
    },
    {
      name: "lastUpdated",
      type: "date",
    },
    {
      name: "isTrending",
      type: "checkbox",
    },
    {
      name: "isRecommended",
      type: "checkbox",
    },
    {
      name: "isHeroArticle",
      type: "checkbox",
    },
    {
      name: "heroPosition",
      type: "number",
    },
    {
      name: "viewsCount",
      type: "number",
    },
    {
      name: "_status",
      type: "text",
    },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
  ],
  timestamps: true,
};