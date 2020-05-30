const project = process.env.PROJECT;

const resolveFile = (file) =>
  `./src/${
    /chrome|firefox/.test(project) ? `extension/${project}` : "demo"
  }/${file}.js`;

module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    "transform-inline-environment-variables",
    "emotion",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-react-jsx",
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
