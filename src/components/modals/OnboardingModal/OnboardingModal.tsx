import { clsx } from "clsx/lite";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import logo from "#assets/logo.svg";
import { Modal } from "#components/Modal/Modal";
import {
  addPopularSitePreset,
  enablePresetThumbnailsIfOff,
  PopularSitesPicker,
} from "#components/modals/PopularSitesModal/PopularSitesModal";
import {
  AppearanceSettingsGroup,
  BookmarkSettingsGroup,
  DialAppearanceSettingsGroup,
  LayoutSettingsGroup,
} from "#components/settings/groups";
import { SETTINGS_SECTION_TITLES } from "#components/settings/SettingsContent";
import { modals } from "#stores/modals";
import { settings } from "#stores/settings";

import "./styles.css";

const STEP_TITLES = [
  "Welcome to Easy Speed Dial",
  SETTINGS_SECTION_TITLES.appearance,
  SETTINGS_SECTION_TITLES.layout,
  SETTINGS_SECTION_TITLES.dialAppearance,
  SETTINGS_SECTION_TITLES.bookmarks,
  "Add Popular Sites",
];

const STEP_DESCRIPTIONS = [
  "",
  "Pick your background and color scheme.",
  "Choose how your dials are arranged on the page.",
  "Adjust the size, shape, labels, and style of your dials.",
  "Pick the folder for your dials and how they open.",
  "Choose sites to add to your default folder.",
];

const TOTAL_STEPS = STEP_TITLES.length;

export const OnboardingModal = observer(function OnboardingModal({
  active,
}: {
  active?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [hasStartedCustomization, setHasStartedCustomization] = useState(false);
  const [selectedPopularSiteKeys, setSelectedPopularSiteKeys] = useState<
    Set<string>
  >(() => new Set());

  function close() {
    modals.closeModal();
  }

  function applyDefaults() {
    if (hasStartedCustomization) {
      settings.resetSettings();
    }
    close();
  }

  async function finishOnboarding() {
    await Promise.all([...selectedPopularSiteKeys].map(addPopularSitePreset));
    enablePresetThumbnailsIfOff();
    close();
  }

  function next() {
    setHasStartedCustomization(true);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function togglePopularSitePreset(presetKey: string) {
    setSelectedPopularSiteKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      if (nextKeys.has(presetKey)) {
        nextKeys.delete(presetKey);
      } else {
        nextKeys.add(presetKey);
      }
      return nextKeys;
    });
  }

  const isLast = step === TOTAL_STEPS - 1;
  const isIntro = step === 0;
  const selectedPopularSiteCount = selectedPopularSiteKeys.size;
  const finishLabel = isLast
    ? selectedPopularSiteCount === 0
      ? "Done"
      : `Add ${selectedPopularSiteCount} ${selectedPopularSiteCount === 1 ? "site" : "sites"}`
    : "Next";

  return (
    <Modal
      title={STEP_TITLES[step]}
      width="540px"
      showDismissButton={false}
      dismissOnPointerDownOutside={false}
      hideTitle={isIntro}
      initialFocus={isIntro ? ".OnboardingModal-primary" : ".modal-title"}
      initialFocusKey={step}
      className="OnboardingModalWrapper"
      active={active}
    >
      <div className="OnboardingModal">
        {!isIntro && (
          <p className="onboarding-step-description">
            {STEP_DESCRIPTIONS[step]}
          </p>
        )}
        <div className="onboarding-step-body">
          {step === 0 && (
            <div className="onboarding-intro">
              <img
                className="onboarding-logo"
                src={logo}
                width="72"
                height="72"
                alt=""
                aria-hidden="true"
              />
              <p className="onboarding-product-name">
                Welcome to Easy Speed Dial
              </p>
              <p>
                Customize your settings now, or use the defaults. You can change
                them later by clicking the gear icon.
              </p>
            </div>
          )}

          {step === 1 && <AppearanceSettingsGroup idPrefix="ob" />}

          {step === 2 && <LayoutSettingsGroup idPrefix="ob" />}

          {step === 3 && <DialAppearanceSettingsGroup idPrefix="ob" />}

          {step === 4 && <BookmarkSettingsGroup idPrefix="ob" />}

          {step === 5 && (
            <PopularSitesPicker
              selectedPresetKeys={selectedPopularSiteKeys}
              onTogglePreset={togglePopularSitePreset}
            />
          )}
        </div>

        <div className="onboarding-footer onboarding-footer-with-progress">
          <div
            className="onboarding-progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step + 1}
            aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}
          >
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "onboarding-progress-dot",
                  i === step && "active",
                  i < step && "completed",
                )}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="onboarding-buttons">
            {isIntro ? (
              <>
                <button
                  type="button"
                  className="btn defaultBtn"
                  onClick={applyDefaults}
                >
                  Use defaults
                </button>
                <button
                  type="button"
                  className="btn submitBtn OnboardingModal-primary"
                  onClick={next}
                >
                  Get started
                </button>
              </>
            ) : (
              <>
                {!isLast && (
                  <button
                    type="button"
                    className="btn defaultBtn"
                    onClick={close}
                  >
                    Skip
                  </button>
                )}
                <button type="button" className="btn defaultBtn" onClick={back}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn submitBtn OnboardingModal-primary"
                  onClick={isLast ? finishOnboarding : next}
                >
                  {finishLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
});
