import { Settings } from "./settings/index.jsx";
import { ProvideOptions } from "useOptions";
import { ProvideBookmarks } from "useBookmarks";
import { render, screen } from "@testing-library/react";

describe("Renders <App />", () => {
  test("App should start", () => {
    render(
      <ProvideOptions>
        <ProvideBookmarks>
          <Settings />
        </ProvideBookmarks>
      </ProvideOptions>,
    );
    expect(screen.getByText("Toolbar Dial - Options")).toBeInTheDocument;
  });
});
