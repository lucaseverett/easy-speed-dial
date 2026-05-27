import { beforeEach, describe, expect, test, vi } from "vitest";

import { applyBackup, buildBackup } from "./backup";

// The backup functions import #lib/storage; mock it so importing backup.ts
// does not pull in the webextension polyfill (which throws outside an
// extension context). getStoredCustomImage is configurable so buildBackup
// tests can vary the stored custom image.
const { customImageKey, getStoredCustomImageMock } = vi.hoisted(() => ({
  customImageKey: "2.0-custom-image",
  getStoredCustomImageMock: vi.fn(() =>
    Promise.resolve<Record<string, unknown>>({}),
  ),
}));

vi.mock("#lib/storage", () => ({
  storageKeys: { customImage: customImageKey },
  getStoredCustomImage: getStoredCustomImageMock,
}));

// A fake settings store: every method applyBackup calls, recorded as a spy.
function createFakeSettings() {
  return {
    resetSettings: vi.fn(),
    restoreCustomImage: vi.fn(() => Promise.resolve()),
    restoreDialColors: vi.fn(),
    restoreDialImages: vi.fn(),
    restoreDialImageSizes: vi.fn(),
    _restoreCustomColor: vi.fn(),
    _restoreWallpaper: vi.fn(),
    handleUsePresetThumbnails: vi.fn(),
    handleShowFavicons: vi.fn(),
    handleAttachTitle: vi.fn(),
    handleDefaultFolder: vi.fn(),
    handleDialSize: vi.fn(),
    handleDragAndDrop: vi.fn(),
    handleGridSpacing: vi.fn(),
    handleMaxColumns: vi.fn(),
    handleNewTab: vi.fn(),
    handleShowDialBorders: vi.fn(),
    handleShowTitle: vi.fn(),
    handleSquareDials: vi.fn(),
    handleSwitchTitle: vi.fn(),
    handleThemeOption: vi.fn(),
    handleTransparentDials: vi.fn(),
  };
}

type FakeSettings = ReturnType<typeof createFakeSettings>;

function apply(settings: FakeSettings, backup: unknown) {
  return applyBackup(
    settings as unknown as Parameters<typeof applyBackup>[0],
    JSON.stringify(backup),
  );
}

// A backup as produced by the current buildBackup (all 21 keys present).
const MODERN_BACKUP = {
  usePresetThumbnails: true,
  showFavicons: true,
  attachTitle: true,
  customColor: "#ff0000",
  customImage: "data:image/png;base64,QUFB",
  defaultFolder: "folder-1",
  dialColors: { "1": "#111111" },
  dialImages: { "2": "data:image/png;base64,QkJC" },
  dialImageSizes: { "2": "contain" },
  dialSize: "medium",
  dragAndDrop: false,
  gridSpacing: "compact",
  maxColumns: "9",
  newTab: true,
  showDialBorders: false,
  showTitle: false,
  squareDials: true,
  switchTitle: true,
  themeOption: "Dark",
  transparentDials: true,
  wallpaper: "wallpaper-3",
};

describe("applyBackup", () => {
  let settings: FakeSettings;

  beforeEach(() => {
    settings = createFakeSettings();
  });

  test("applies every field from a current-format backup", async () => {
    await apply(settings, MODERN_BACKUP);

    expect(settings.resetSettings).toHaveBeenCalledTimes(1);
    expect(settings.restoreCustomImage).toHaveBeenCalledWith(
      "data:image/png;base64,QUFB",
    );
    expect(settings.handleUsePresetThumbnails).toHaveBeenCalledWith(true);
    expect(settings.handleShowFavicons).toHaveBeenCalledWith(true);
    expect(settings.handleAttachTitle).toHaveBeenCalledWith(true);
    expect(settings._restoreCustomColor).toHaveBeenCalledWith("#ff0000");
    expect(settings.handleDefaultFolder).toHaveBeenCalledWith("folder-1");
    expect(settings.restoreDialColors).toHaveBeenCalledWith({ "1": "#111111" });
    expect(settings.restoreDialImages).toHaveBeenCalledWith(
      { "2": "data:image/png;base64,QkJC" },
      { "2": "contain" },
    );
    expect(settings.restoreDialImageSizes).not.toHaveBeenCalled();
    expect(settings.handleDialSize).toHaveBeenCalledWith("medium");
    expect(settings.handleDragAndDrop).toHaveBeenCalledWith(false);
    expect(settings.handleGridSpacing).toHaveBeenCalledWith("compact");
    expect(settings.handleMaxColumns).toHaveBeenCalledWith("9");
    expect(settings.handleNewTab).toHaveBeenCalledWith(true);
    expect(settings.handleShowDialBorders).toHaveBeenCalledWith(false);
    expect(settings.handleShowTitle).toHaveBeenCalledWith(false);
    expect(settings.handleSquareDials).toHaveBeenCalledWith(true);
    expect(settings.handleSwitchTitle).toHaveBeenCalledWith(true);
    expect(settings._restoreWallpaper).toHaveBeenCalledWith("wallpaper-3");
    expect(settings.handleThemeOption).toHaveBeenCalledWith("Dark");
    expect(settings.handleTransparentDials).toHaveBeenCalledWith(true);
  });

  test("resets settings before applying any field", async () => {
    await apply(settings, { dialSize: "medium" });

    expect(settings.resetSettings).toHaveBeenCalledTimes(1);
    expect(settings.resetSettings.mock.invocationCallOrder[0]).toBeLessThan(
      settings.handleDialSize.mock.invocationCallOrder[0],
    );
  });

  test("ignores optional fields that are absent from the backup", async () => {
    await apply(settings, { dialSize: "medium" });

    expect(settings.handleDialSize).toHaveBeenCalledWith("medium");
    expect(settings.handleAttachTitle).not.toHaveBeenCalled();
    expect(settings._restoreCustomColor).not.toHaveBeenCalled();
    expect(settings.handleDefaultFolder).not.toHaveBeenCalled();
    expect(settings.handleThemeOption).not.toHaveBeenCalled();
    expect(settings._restoreWallpaper).not.toHaveBeenCalled();
    expect(settings.restoreDialColors).not.toHaveBeenCalled();
    expect(settings.restoreCustomImage).not.toHaveBeenCalled();
  });

  test("applies a field even when its value is false", async () => {
    // Relies on hasOwnProperty rather than truthiness.
    await apply(settings, { attachTitle: false });

    expect(settings.handleAttachTitle).toHaveBeenCalledWith(false);
  });

  describe("legacy backups missing newer settings", () => {
    test("falls back to pre-setting defaults when newer keys are absent", async () => {
      await apply(settings, { dialSize: "small" });

      expect(settings.handleUsePresetThumbnails).toHaveBeenCalledWith(false);
      expect(settings.handleGridSpacing).toHaveBeenCalledWith("spacious");
      expect(settings.handleShowDialBorders).toHaveBeenCalledWith(false);
    });

    test("uses the backup values when the newer keys are present", async () => {
      await apply(settings, {
        usePresetThumbnails: true,
        gridSpacing: "compact",
        showDialBorders: true,
      });

      expect(settings.handleUsePresetThumbnails).toHaveBeenCalledWith(true);
      expect(settings.handleGridSpacing).toHaveBeenCalledWith("compact");
      expect(settings.handleShowDialBorders).toHaveBeenCalledWith(true);
    });
  });

  describe("dial image restore", () => {
    test("restores dialImages with sizes and skips the sizes-only path", async () => {
      await apply(settings, {
        dialImages: { "1": "img" },
        dialImageSizes: { "1": "contain" },
      });

      expect(settings.restoreDialImages).toHaveBeenCalledWith(
        { "1": "img" },
        { "1": "contain" },
      );
      expect(settings.restoreDialImageSizes).not.toHaveBeenCalled();
    });

    test("restores dialImages even when sizes are absent", async () => {
      await apply(settings, { dialImages: { "1": "img" } });

      expect(settings.restoreDialImages).toHaveBeenCalledWith(
        { "1": "img" },
        undefined,
      );
      expect(settings.restoreDialImageSizes).not.toHaveBeenCalled();
    });

    test("restores dialImageSizes alone when dialImages is absent", async () => {
      await apply(settings, { dialImageSizes: { "1": "contain" } });

      expect(settings.restoreDialImageSizes).toHaveBeenCalledWith({
        "1": "contain",
      });
      expect(settings.restoreDialImages).not.toHaveBeenCalled();
    });

    test("restores neither when both are absent", async () => {
      await apply(settings, { dialSize: "small" });

      expect(settings.restoreDialImages).not.toHaveBeenCalled();
      expect(settings.restoreDialImageSizes).not.toHaveBeenCalled();
    });
  });

  describe("custom image", () => {
    test("restores the custom image when present", async () => {
      await apply(settings, { customImage: "data:image/png;base64,QUFB" });

      expect(settings.restoreCustomImage).toHaveBeenCalledWith(
        "data:image/png;base64,QUFB",
      );
    });

    test("skips custom image restore when absent or empty", async () => {
      await apply(settings, { customImage: "" });
      await apply(settings, { dialSize: "small" });

      expect(settings.restoreCustomImage).not.toHaveBeenCalled();
    });
  });

  test("does not throw and logs an error on malformed JSON", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await expect(
      applyBackup(
        settings as unknown as Parameters<typeof applyBackup>[0],
        "{ not valid json",
      ),
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalled();
    expect(settings.resetSettings).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});

// A settings store with every persisted field populated.
function createSettingsValues() {
  return {
    usePresetThumbnails: true,
    showFavicons: false,
    attachTitle: false,
    customColor: "#abcabc",
    customImage: "blob:in-memory-url",
    defaultFolder: "folder-9",
    dialColors: { "3": "#333333" },
    dialImages: { "4": "blob:dial-img" },
    dialImageSizes: { "4": "cover" },
    dialSize: "large",
    dragAndDrop: true,
    gridSpacing: "default",
    maxColumns: "5",
    newTab: true,
    showDialBorders: true,
    showTitle: true,
    squareDials: false,
    switchTitle: false,
    themeOption: "Light",
    transparentDials: false,
    wallpaper: "wallpaper-1",
  };
}

function build(values: Record<string, unknown>) {
  return buildBackup(values as unknown as Parameters<typeof buildBackup>[0]);
}

describe("buildBackup", () => {
  beforeEach(() => {
    getStoredCustomImageMock.mockReset();
    getStoredCustomImageMock.mockResolvedValue({});
  });

  test("copies every persisted setting into the backup", async () => {
    const values = createSettingsValues();

    const backup = await build(values);

    // Exact shape: all 21 persisted keys, nothing else.
    expect(backup).toEqual(values);
  });

  test("swaps customImage for the stored base64", async () => {
    getStoredCustomImageMock.mockResolvedValue({
      [customImageKey]: "data:image/png;base64,QUFB",
    });

    const backup = await build(createSettingsValues());

    // The in-memory value is a blob URL; the backup must hold the base64.
    expect(backup.customImage).toBe("data:image/png;base64,QUFB");
  });

  test("keeps the in-memory customImage when nothing is stored", async () => {
    getStoredCustomImageMock.mockResolvedValue({});

    const backup = await build(createSettingsValues());

    expect(backup.customImage).toBe("blob:in-memory-url");
  });

  test("keeps the in-memory customImage when the stored value is empty", async () => {
    getStoredCustomImageMock.mockResolvedValue({ [customImageKey]: "" });

    const backup = await build(createSettingsValues());

    expect(backup.customImage).toBe("blob:in-memory-url");
  });

  test("omits store state that should not be exported", async () => {
    const backup = await build({
      ...createSettingsValues(),
      colorScheme: "color-scheme-dark",
      firstRun: true,
      showUpgradeToast: true,
    });

    expect(backup).not.toHaveProperty("colorScheme");
    expect(backup).not.toHaveProperty("firstRun");
    expect(backup).not.toHaveProperty("showUpgradeToast");
  });
});
