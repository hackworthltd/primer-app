module.exports = {
  "primer-api": {
    input: {
      target: "./primer-api.json",
      validation: true,
    },
    output: {
      mode: "split",
      workspace: "./src/primer-api",
      target: "./primer-api.ts",
      schemas: "model",
      client: "react-query",
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: "./mutator/use-custom-instance.ts",
          name: "useCustomInstance",
        },
      },
    },
  },
};
