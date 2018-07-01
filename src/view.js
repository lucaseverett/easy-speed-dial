import { h } from "hyperapp";
import randomMC from "random-material-color";

const Bookmark = ({ title, url, type, name }) => {
  let color = randomMC.getColor({
    shades: ["700"],
    text: name.join(".")
  });

  if (type === "file") {
    name = (
      <div class={name.join(".").length < 16 ? "domain" : "domainSmall"}>
        {name.join(".")}
      </div>
    );
  } else if (name.length === 3 && name[0].length < name[1].length) {
    name = name.map((n, i) => {
      if (i === 0) {
        return <div class="small align-left">{n}</div>;
      } else if (i + 1 === name.length) {
        return <div class="small align-right">{n}</div>;
      }
      return <div class="domain">{n}</div>;
    });
  } else if (name.length === 2) {
    name = name.map((n, i) => {
      if (i === 0) {
        return (
          <div class={n.length < 16 ? "domain two" : "domainSmall two"}>
            {n}
          </div>
        );
      }
      return <div class="small align-right">{n}</div>;
    });
  } else if (
    name[0].length > name[1].length ||
    name[0].length === name[1].length
  ) {
    name = (
      <div>
        <div class={name[0].length < 16 ? "domain two" : "domainSmall two"}>
          {name[0]}
        </div>
        <div class="small align-right">
          {name
            .splice(1)
            .map(n => n)
            .join(".")}
        </div>
      </div>
    );
  } else {
    name = (
      <div>
        <div class="small align-left">{name[0]}</div>
        <div class="domain">{name[1]}</div>
        <div class="small align-right">
          {name
            .splice(2)
            .map(n => n)
            .join(".")}
        </div>
      </div>
    );
  }

  return (
    <div class="bookmark">
      <a href={url} rel="noreferrer">
        <div
          class="urlBox"
          style={{
            backgroundColor: color
          }}
        >
          <div class="url">{name}</div>
        </div>
        <div class="title">{title}</div>
      </a>
    </div>
  );
};

export default ({ bookmarks }) => (
  <div class="bookmarks-list">
    {bookmarks.map(bookmark => <Bookmark {...bookmark} />)}
  </div>
);
