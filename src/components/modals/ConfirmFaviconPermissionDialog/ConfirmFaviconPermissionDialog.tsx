import { ConfirmDialog } from "#components/modals/ConfirmDialog/ConfirmDialog";
import { requestFaviconPermission } from "#lib/optionalPermissions";
import { settings } from "#stores/settings";

export function ConfirmFaviconPermissionDialog() {
  const title = __CHROME__
    ? "Allow Chrome to provide favicons?"
    : "Allow DuckDuckGo to provide favicons?";
  const description = __CHROME__ ? (
    <>
      Enabling this uses Chrome&apos;s built-in favicon feature to show a site
      icon next to each dial.
    </>
  ) : (
    <>
      Enabling this fetches favicons from{" "}
      <a
        className="textLink"
        href="https://duckduckgo.com/duckduckgo-help-pages/privacy/favicons"
        target="_blank"
        rel="noreferrer"
      >
        DuckDuckGo
      </a>
      . Only the bookmark&apos;s domain is shared. Full URLs are never shared.
    </>
  );

  return (
    <ConfirmDialog
      title={title}
      variant="info"
      description={description}
      confirmLabel="Continue"
      onConfirm={async () => {
        const granted = await requestFaviconPermission();
        if (granted) {
          settings.handleShowFavicons(true);
        }
      }}
    />
  );
}
