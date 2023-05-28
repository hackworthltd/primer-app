## Z-index use in the UI

To manage layers, we use the following z-indices in the UI.

Some notes:

- By default, Tailwind CSS only supports 6 distinct z-index classes
  (`z-0`, `z-10`, ..., `z-50`), and we stick with that for now.

- Most elements don't specify an explicit z-index. Presumably these
  are equivalent to `z-0`.

- Some z-index values may be used by more than one type of element.
  This is fine, so long as it's never the case that these elements can
  overlap.

| Z-index | Element(s)                               |
| ------- | ---------------------------------------- |
| `z-10`  | Tree edges                               |
| `z-20`  | Tree node flavor labels                  |
| `z-30`  | Floating toolbar (editor)                |
| `z-40`  | Drop-down menus<br/>Nav bars<br/>Footers |
| `z-50`  | Modal dialogs                            |
