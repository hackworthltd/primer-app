import { MemoryRouter } from "react-router-dom";

// Support React Router v6.
//
// See:
// https://github.com/gvaldambrini/storybook-router/issues/53#issuecomment-962399619
export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  )
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
