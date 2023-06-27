import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIObject } from "openapi3-ts";
import { resolveConfig } from "prettier";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";

const main = async () => {
  const openApiDoc = (await SwaggerParser.parse(
    "./primer-api.json"
  )) as OpenAPIObject;
  const prettierConfig = await resolveConfig("./");
  await generateZodClientFromOpenAPI({
    openApiDoc,
    templatePath: "./primer-client.hbs",
    distPath: "./src/primer-client.ts",
    prettierConfig,
    options: {
      withAlias: true,
      shouldExportAllSchemas: true,
      isMediaTypeAllowed: (mediaType) =>
        mediaType === "application/json;charset=utf-8",
    },
  });
};

main();
