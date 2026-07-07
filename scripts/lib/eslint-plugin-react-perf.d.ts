// eslint-plugin-react-perf has no bundled types and no @types package.
declare module "eslint-plugin-react-perf" {
  interface ReactPerfConfig {
    rules?: Record<string, unknown>;
  }

  const plugin: {
    configs: Record<string, ReactPerfConfig>;
  };

  export default plugin;
}
