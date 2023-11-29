import { FieldHook } from "payload/types";

export const formatSlug: FieldHook = async ({ value, data }) => {
  return data?.slugText?.replace(/ /g, "-").toLowerCase() ?? value;
};

export const tagToLowerCase: FieldHook = async ({ value }) => {
  return value?.map((item) => {
    if (item.tag) {
      return {
        ...item,
        tag: item.tag.toLowerCase(),
      };
    }
    return value;
  });
};
