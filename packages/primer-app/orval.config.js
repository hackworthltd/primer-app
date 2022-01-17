module.exports = {
  "primer-api": {
    output: {
      mode: "split",
      workspace: "./src/primer-api",
      target: "./primer-api.ts",
      schemas: "model",
      client: "react-query",
      mock: true,
      prettier: true,
    },
    input: {
      target: "./primer-api.json",
      validation: true,
    },
  },
};
