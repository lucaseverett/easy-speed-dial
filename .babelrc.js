const project = process.env.PROJECT;

const resolveFile = (file) =>
  `./src/${
    /chrome|firefox/.test(project) ? `extension/${project}` : "demo"
  }/${file}.js`;

module.exports = {
  plugins: [
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
