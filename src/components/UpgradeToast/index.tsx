import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

import "sonner/dist/styles.css";
import "./styles.css";

import logo from "#assets/logo.svg";
import { modals } from "#stores/useModals";
import { settings } from "#stores/useSettings";

const appVersion = __APP_VERSION__;
const upgradeToastId = "upgrade-toast";

export const UpgradeToast = observer(function UpgradeToast() {
  const showUpgradeToast = settings.showUpgradeToast;

  useEffect(() => {
    if (!showUpgradeToast) {
      toast.dismiss(upgradeToastId);
      return;
    }

    toast(`Updated to Version ${appVersion}`, {
      id: upgradeToastId,
      className: "upgrade-toast",
      closeButton: true,
      duration: Infinity,
      icon: (
        <img
          src={logo}
          width="28"
          height="28"
          alt=""
          className="upgrade-toast-icon"
          aria-hidden="true"
          draggable="false"
        />
      ),
      onDismiss: settings.hideUpgradeToast,
      action: {
        label: "What's New",
        onClick: (e) => {
          modals.openModal({
            modal: "whats-new",
            focusAfterClosed: e.currentTarget,
          });
        },
      },
    });
  }, [showUpgradeToast]);

  return (
    <Toaster
      position="bottom-right"
      theme={settings.colorScheme === "color-scheme-dark" ? "dark" : "light"}
      style={{ "--width": "360px" } as React.CSSProperties}
    />
  );
});
