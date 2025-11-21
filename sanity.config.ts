import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET!;

export default defineConfig({
  name: "ridercritic",
  title: "ridercritic CMS",
  projectId,
  dataset,
  basePath: "/dashboard/admin/blog-studio",
  plugins: [visionTool()],
  schema: {
    types: schemaTypes,
  },
});
