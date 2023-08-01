export function filter(bookmarks) {
  function getLinkName(url) {
    // Split by '://'
    let protocolSplit = url.split("://");
    let parts = [];

    // If '://' exists in the url
    if (protocolSplit[1]) {
      let domainPathSplit = protocolSplit[1].split("/");
      let domainParts = domainPathSplit[0].split(".");

      // Check if first part is 'www', if yes then remove it
      if (domainParts[0] === "www") {
        domainParts.shift();
      }

      if (domainParts.length > 3) {
        parts = [
          domainParts[0],
          domainParts[1],
          domainParts.slice(2).join("."),
        ];
      } else {
        parts = domainParts;
      }
    } else {
      // For URLs like "mailto:user@example.com", return everything after first ':'
      let colonIndex = url.indexOf(":");
      if (colonIndex !== -1) {
        parts = [url.substring(colonIndex + 1)];
      } else {
        parts = [url];
      }
    }

    return parts;
  }

  return bookmarks
    .filter(
      ({ url = "", type }) =>
        !url.match(/^(javascript|place|about|chrome|edge|file|data|blob):/i) &&
        type !== "separator",
    )
    .map(({ title, url, id, parentId, index }) => {
      if (url) {
        let name = getLinkName(url);
        return { title, url, type: "link", name, id, parentId, index };
      } else {
        return { type: "folder", title, name: [title], id, parentId, index };
      }
    });
}
