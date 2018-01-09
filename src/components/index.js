import { html, render } from "../hyperhtml.js";
import randomMC from "random-material-color";

const init = data => {
  display(data);
};

const getName = name => {
  name = /https?:\/\/(?:www\.)?(.*?)(?:\?|\/)/i.exec(name)[1].toLowerCase();
  return name.split(".");
};

const display = bookmarks => {
  let bookmarksList = bookmarks.map(({ title, url }) => {
    let name = getName(url);
    let color = randomMC.getColor({
      shades: ["700"],
      text: name.join(".")
    });
    if (name.length === 3 && name[0].length < name[1].length) {
      name = name.map((n, i) => {
        if (i === 0) {
          return `<div class="small align-left">${n}</div>`;
        } else if (i + 1 === name.length) {
          return `<div class="small align-right">${n}</div>`;
        }
        return `<div class="domain">${n}</div>`;
      });
    } else if (name.length === 2) {
      name = name.map((n, i) => {
        if (i === 0) {
          return `<div class="domain two">${n}</div>`;
        }
        return `<div class="small align-right">${n}</div>`;
      });
    } else if (
      name[0].length > name[1].length ||
      name[0].length === name[1].length
    ) {
      name = html`<div class="domain two">${
        name[0]
      }</div><div class="small align-right">${name
        .splice(1)
        .map(n => `${n}`)
        .join(".")}</div>`;
    } else {
      name = html`<div class="small align-left">${
        name[0]
      }</div><div class="domain">${
        name[1]
      }</div><div class="small align-right">${name
        .splice(2)
        .map(n => `${n}`)
        .join(".")}</div>`;
    }
    return html`
      <div class="bookmark">
        <a href=${url} rel="noreferrer">
        <div class="urlBox" style=${{
          backgroundColor: color
        }}>
          <div class="url">
          ${name}
          </div>
        </div>
        <div class="title">
          ${title}
        </div>
        </a>
      </div>
      `;
  });
  let content = render`
  <div class="bookmarks-list">${bookmarksList}</div>
  `;
};

export default init;
