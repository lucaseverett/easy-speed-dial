import browser from "#platform/browser";

export function openBackgroundTab(url: string) {
  return browser.tabs.create({ url, active: false });
}

export function openTab(url: string) {
  return browser.tabs.create({ url });
}

export function openWindow(url: string | string[]) {
  return browser.windows.create({ url });
}
