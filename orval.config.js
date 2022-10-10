// For some complex requests, we use POST in order to send a body with what would otherwise be a GET.
// This lists the operation IDs for such requests.
// We configure Orval to generate simple `useQuery`-based code, as it would for a GET request,
// rather than its default `useMutation` approach for POSTs.
const getStylePostRequests = ["getAvailableActions"];
const useQueryPost = Object.assign(
  ...getStylePostRequests.map((op) => {
    return {
      [op]: {
        query: {
          useQuery: true,
        },
      },
    };
  })
);

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
      // We do not yet use the generated mocks.
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: "./mutator/use-custom-instance.ts",
          name: "useCustomInstance",
        },
        operations: {
          ...useQueryPost,
        },
      },
    },
  },
};
