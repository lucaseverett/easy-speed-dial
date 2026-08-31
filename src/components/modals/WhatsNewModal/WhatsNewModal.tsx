import { Modal } from "#components/Modal/Modal";
import { NewPill } from "#components/NewPill/NewPill";
import { getUnseenWhatsNewFeatures } from "#lib/whatsNew";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

import "./styles.css";

export function WhatsNewModal() {
  const unseenFeatures = getUnseenWhatsNewFeatures(
    settings.whatsNewSeenThrough,
    __APP_VERSION__,
  );

  function handleDismiss() {
    settings.acknowledgeWhatsNew();
  }

  function handleOpenSettings(e: React.MouseEvent<HTMLButtonElement>) {
    settings.acknowledgeWhatsNew();
    modals.openModal({
      modal: "settings-panel",
      focusAfterClosed: e.currentTarget,
    });
  }

  return (
    <Modal
      {...{
        title: "What's New",
        width: "470px",
        initialFocus: ".modal-title",
        onDismiss: handleDismiss,
      }}
    >
      <div className="WhatsNew">
        <div className="WhatsNew-highlights">
          {unseenFeatures.map(({ version, title, description }) => (
            <section className="WhatsNew-card" key={`${version}:${title}`}>
              <div className="WhatsNew-cardHeader">
                <h2>{title}</h2>
                <NewPill />
              </div>
              <p>{description}</p>
            </section>
          ))}
        </div>
        <div className="WhatsNew-footer">
          <a
            className="textLink WhatsNew-releaseNotesLink"
            href="https://easyspeeddial.com/release-notes"
            rel="noreferrer"
            target="_blank"
          >
            View release notes
            <svg
              className="WhatsNew-externalIcon"
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 -960 960 960"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
            </svg>
          </a>
          <button
            className="btn submitBtn WhatsNew-settingsBtn"
            onClick={handleOpenSettings}
          >
            Open Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}
