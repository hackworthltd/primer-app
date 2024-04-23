import { UseQueryOptions } from "@tanstack/react-query";
import type { OperationOptions } from "@orval/core";
import { defineConfig } from "orval";

// For some complex requests, we use POST in order to send a body with what would otherwise be a GET.
// This lists the operation IDs for such requests.
// We configure Orval to generate simple `useQuery`-based code, as it would for a GET request,
// rather than its default `useMutation` approach for POSTs.
const getStylePostRequests = [
  "getAvailableActions",
  "eval-full",
  "eval-bounded-interp",
];
const useQueryPost: {
  [key: string]: OperationOptions;
} = Object.assign(
  {},
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

// gc immediately, to disable showing cached data.
const queryOpts: UseQueryOptions = { gcTime: 0 };

export default defineConfig({
  "primer-api": {
    input: {
      target: "./primer-api.json",
      // Disabled until we can deal with the myriad validation issues
      // that the IBM OpenAPI validator raises.
      validation: false,
    },
    output: {
      mode: "split",
      workspace: "./src/primer-api",
      target: "./primer-api.ts",
      // cleaning the output ensures idempotency
      clean: true,
      schemas: "model",
      client: "react-query",
      // We do not yet use the generated mocks.
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: "../orval/mutator/use-custom-instance.ts",
          name: "useCustomInstance",
        },
        operations: {
          ...useQueryPost,
        },
        useDates: true,
        query: { options: queryOpts },
      },
    },
  },
});
