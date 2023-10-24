import path from "path";

import { buildConfig } from "payload/config";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { viteBundler } from "@payloadcms/bundler-vite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import Users from "./collections/Users";
import { Articles } from "./collections/Articles";
import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    // css: path.resolve(__dirname'./custom.css),
  },
  editor: lexicalEditor({}),
  collections: [Users, Articles, Authors, Categories, Media],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
