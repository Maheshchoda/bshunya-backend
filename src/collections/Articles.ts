import { CollectionConfig, FieldHook } from "payload/types";
import HandleArticle from "../lib/HandleArticle";
import StoreArticleSnapshot from "../lib/StoreArticleSnapshot";
import HandleDelete from "../cloudImage/api/DeleteImage";

const formatSlug: FieldHook = async ({ value, data }) => {
  return data?.title?.replace(/ /g, "-").toLowerCase() ?? value;
};

export const Articles: CollectionConfig = {
  slug: "articles",
  auth: false,
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    beforeChange: [HandleArticle],
    afterChange: [StoreArticleSnapshot],
    afterDelete: [HandleDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
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
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
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
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
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
      defaultValue: false,
    },
    {
      name: "heroPosition",
      type: "number",
      admin: {
        condition: (data) => data.isHeroArticle,
      },
    },
    {
      name: "viewsCount",
      type: "number",
      defaultValue: 0,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
  timestamps: true,
};
