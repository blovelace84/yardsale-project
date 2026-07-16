import "@testing-library/jest-dom/vitest";

if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = () => "blob:mock";
}

if (!globalThis.URL.revokeObjectURL) {
  globalThis.URL.revokeObjectURL = () => undefined;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}
