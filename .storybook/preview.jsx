import { MemoryRouter } from "react-router-dom";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { rest } from "msw";

// Initialize MSW.
initialize({
  onUnhandledRequest: ({ method, url }) => {
    if (url.pathname.startsWith("/openapi")) {
      console.error(`Unhandled ${method} request to ${url}`);
    }
  },
});

// Support React Router v6.
//
// See:
// https://github.com/gvaldambrini/storybook-router/issues/53#issuecomment-962399619
export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
  mswDecorator,
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: {
      sessions: [
        rest.delete("/openapi/sessions/:sessionId", (_, res, ctx) => {
          return res(ctx.status(204));
        }),
      ],
    },
  },
};
