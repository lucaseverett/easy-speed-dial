import { Bookmarks } from "./bookmarks/index.jsx";
import { ProvideOptions } from "./demo/useOptions.jsx";
import { ProvideBookmarks } from "./demo/useBookmarks.jsx";
import { render, screen } from "@testing-library/react";

describe("Renders <App />", () => {
  test("App should start", () => {
    render(
      <ProvideOptions>
        <ProvideBookmarks>
          <Bookmarks />
        </ProvideBookmarks>
      </ProvideOptions>
    );
    expect(screen.getByText("amazon")).toBeInTheDocument;
  });
});
