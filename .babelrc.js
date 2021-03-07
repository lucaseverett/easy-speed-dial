const project = process.env.PROJECT;

const resolveFile = (file) =>
  `./src/${
    /chrome|firefox/.test(project) ? `extension/${project}` : "demo"
  }/${file}.js`;

module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
      },
    ],
    "@emotion",
    [
      "module-resolver",
      {
        alias: {
          useOptions: () => resolveFile("useOptions"),
          useBookmarks: () => resolveFile("useBookmarks"),
          useContextMenu: () => resolveFile("useContextMenu"),
        },
      },
    ],
  ],
};
