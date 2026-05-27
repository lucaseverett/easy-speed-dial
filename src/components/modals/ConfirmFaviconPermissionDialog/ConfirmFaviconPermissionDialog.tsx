import { ConfirmDialog } from "#components/modals/ConfirmDialog/ConfirmDialog";
import { requestFaviconPermission } from "#lib/optionalPermissions";
import { settings } from "#stores/settings";

export function ConfirmFaviconPermissionDialog() {
  return (
    <ConfirmDialog
      title="Allow DuckDuckGo to provide favicons?"
      variant="info"
      description={
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
          . Only the bookmark&apos;s domain is shared. Full URLs are never
          shared.
        </>
      }
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
