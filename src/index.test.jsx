import { Bookmarks } from "./bookmarks/index.jsx";
import { ProvideOptions } from "useOptions";
import { ProvideBookmarks } from "useBookmarks";
import { ProvideContextMenu } from "./bookmarks/useContextMenu.jsx";
import { ProvideModals } from "./bookmarks/useModals.jsx";
import { render, screen } from "@testing-library/react";

describe("Renders <App />", () => {
  test("App should start", () => {
    render(
      <ProvideOptions>
        <ProvideBookmarks>
          <ProvideModals>
            <ProvideContextMenu>
              <Bookmarks />
            </ProvideContextMenu>
          </ProvideModals>
        </ProvideBookmarks>
      </ProvideOptions>,
    );
    expect(screen.getByText("amazon")).toBeInTheDocument;
  });
});
