import { useEffect } from "react";

import { Modal } from "#components/Modal/Modal";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

import "./styles.css";

export function WhatsNewModal() {
  useEffect(() => {
    settings.hideUpgradeIndicator();
  }, []);

  function handleOpenSettings(e: React.MouseEvent<HTMLButtonElement>) {
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
      }}
    >
      <div className="WhatsNew">
        <div className="WhatsNew-highlights">
          <section className="WhatsNew-card">
            <div className="WhatsNew-cardHeader">
              <h2>Show Favicons</h2>
              <span className="WhatsNew-newPill" aria-label="New feature">
                New
              </span>
            </div>
            <p>
              Turn on &quot;Show Favicons&quot; in Settings to display each
              site&apos;s favicon beside its dial title.
              {__FIREFOX__ &&
                " Favicons are fetched from DuckDuckGo using only the bookmark's domain."}
            </p>
          </section>
          <section className="WhatsNew-card">
            <div className="WhatsNew-cardHeader">
              <h2>Drag and Drop control</h2>
              <span className="WhatsNew-newPill" aria-label="New feature">
                New
              </span>
            </div>
            <p>
              A new &quot;Drag and Drop&quot; setting lets you turn dial
              dragging off if you&apos;d rather not move dials by accident.
            </p>
          </section>
          <section className="WhatsNew-card">
            <div className="WhatsNew-cardHeader">
              <h2>Grid spacing options</h2>
              <span className="WhatsNew-newPill" aria-label="New feature">
                New
              </span>
            </div>
            <p>
              Pick Compact, Default, or Spacious in Settings to control how
              tightly dials are packed on the page.
            </p>
          </section>
          <section className="WhatsNew-card">
            <div className="WhatsNew-cardHeader">
              <h2>Quickly add popular sites</h2>
              <span className="WhatsNew-newPill" aria-label="New feature">
                New
              </span>
            </div>
            <p>
              Right-click an empty spot in the grid and choose &quot;Add popular
              sites&quot; to drop in dials for sites you use most.
            </p>
          </section>
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
