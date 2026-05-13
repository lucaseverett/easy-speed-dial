/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import { useState } from "react";

import { Modal } from "#components/Modal";

import "./styles.css";

export function WhatsNewModal() {
  const [showPreviousUpdates, setShowPreviousUpdates] = useState(false);

  function handleViewChange(
    e: React.MouseEvent<HTMLAnchorElement>,
    nextShowPreviousUpdates: boolean,
  ) {
    e.preventDefault();
    e.currentTarget.closest(".scroll-box")?.scrollTo({ top: 0 });
    setShowPreviousUpdates(nextShowPreviousUpdates);
  }

  return (
    <Modal
      {...{
        title: "What's New",
        width: "470px",
        height: "450px",
        initialFocus: showPreviousUpdates
          ? ".WhatsNew-backLink"
          : ".modal-title",
        initialFocusKey: showPreviousUpdates,
      }}
    >
      <div className="scroll-focus" tabIndex={0}>
        <div className="WhatsNew">
          {!showPreviousUpdates ? (
            <>
              <div>
                <h2>Version 2.14.1</h2>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Reduced bottom padding when using Compact grid spacing.
                  </li>
                </ul>
              </div>
              <a
                href="#previous-updates"
                className="textLink WhatsNew-link"
                onClick={(e) => handleViewChange(e, true)}
              >
                View previous updates
              </a>
            </>
          ) : (
            <>
              <a
                href="#latest"
                className="textLink WhatsNew-backLink"
                onClick={(e) => handleViewChange(e, false)}
              >
                Back to latest
              </a>
              <div>
                <h2>Version 2.14.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>
                    Added a setup guide for new installs to choose appearance,
                    layout, dial, and bookmark settings.
                  </li>
                  <li>
                    Added &quot;Add popular sites&quot; context menu for adding
                    popular sites.
                  </li>
                  <li>
                    Added a &quot;Use Preset Thumbnails&quot; setting for
                    automatically applying preset thumbnails to popular sites.
                  </li>
                  <li>
                    Added Grid Spacing options: Compact, Default, and Spacious.
                    Spacious uses the previous spacing.
                  </li>
                  {__FIREFOX__ && (
                    <li>
                      Bookmark separators now appear as divider lines in the
                      grid.
                    </li>
                  )}
                  {!__FIREFOX__ && (
                    <li>
                      Folders named &quot;---&quot; now appear as divider lines
                      in the grid.
                    </li>
                  )}
                  <li>
                    Added &quot;Fill dial&quot; and &quot;Fit image&quot;
                    options when editing bookmarks with custom thumbnails.
                  </li>
                  <li>
                    Added a reset action for clearing all custom dial colors and
                    thumbnails.
                  </li>
                  {!__FIREFOX__ && (
                    <li>
                      Added a dropper button to the color picker for sampling
                      colors from the screen.
                    </li>
                  )}
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Reorganized background settings into separate color and
                    image sections.
                  </li>
                  <li>
                    Replaced the upgrade banner with a smaller update toast.
                  </li>
                  <li>
                    Updated import and export settings labels to make backing up
                    and restoring settings clearer.
                  </li>
                  <li>
                    Combined the Light and Dark wallpaper options into one Theme
                    wallpaper option that follows the selected color scheme.
                  </li>
                  <li>
                    Updated folder dials with a two-tone icon so they stand out
                    more from bookmark dials.
                  </li>
                  <li>
                    Removed the option to set custom thumbnails on folders.
                  </li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Added confirmation before resetting settings.</li>
                  <li>Improved wallpaper selection on smaller screens.</li>
                  <li>Minor bug fixes and accessibility enhancements.</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.13.1</h2>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Fixed color picker being cut off on smaller screens.</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.13.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>
                    Added a settings icon at the top right of the page that
                    opens an integrated settings panel
                  </li>
                  <li>
                    Added option for transparent dials, to show the background
                    image behind them
                  </li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.12.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>Added option to change the size of dials</li>
                  <li>
                    Added option to change the shape of dials to be a square
                  </li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Improved grid layout with tighter spacing to fit more dials
                    on screen
                  </li>
                  <li>
                    Updated font from Roboto to Inter for better readability
                  </li>
                </ul>
              </div>
              <div>
                <h2>Version 2.11.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>
                    Added ability to select a folder when adding or editing
                    bookmarks and folders
                  </li>
                  <li>
                    Drag a bookmark or folder onto a bookmark to create a new
                    folder, with both moved into the new folder
                  </li>
                  <li>
                    Drag a bookmark or folder onto a folder to move it into the
                    folder
                  </li>
                  <li>
                    Drag a bookmark or folder onto the breadcrumb to move it to
                    the parent folder
                  </li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Pressing escape will now cancel a drag and drop operation,
                    returning the dragged item to its original position
                  </li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                  <li>Accessibility enhancements</li>
                  <li>Performance enhancements</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.10.2</h2>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.10.1</h2>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.10.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>Added Earth Horizon wallpaper</li>
                  <li>Replaced Snow-Covered Mountain wallpaper</li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                  <li>Minor performance enhancements</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.9</h2>
                <h3>New features</h3>
                <ul>
                  <li>&quot;Select custom thumbnail&quot; (context menu)</li>
                  <li>&quot;Clear custom thumbnail&quot; (context menu)</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.8</h2>
                <h3>New features</h3>
                <ul>
                  <li>Toolbar Dial is now Easy Speed Dial.</li>
                  <li>Added Backup/Restore feature to Settings</li>
                  <li>Added ability to remove custom background image</li>
                  <li>Added Reset feature to Settings</li>
                  <li>Added custom dial colors feature</li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Added functionality to automatically toggle between
                    light/dark versions of some wallpapers when Color Scheme
                    changes
                  </li>
                  <li>
                    Merged &quot;Open all in background tabs&quot; and
                    &quot;Open all in new tabs&quot; into a single context menu
                  </li>
                  <li>Shift + right click now opens browser context menu</li>
                  <li>Made some UI tweaks to the Settings page</li>
                  <li>Made some UI tweaks to modals</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.7</h2>
                <h3>New features</h3>
                <ul>
                  <li>&quot;New bookmark&quot; (context menu)</li>
                  <li>&quot;New folder&quot; (context menu)</li>
                  <li>&quot;Edit&quot; bookmark/folder (context menu)</li>
                  <li>
                    &quot;Open all in background tabs&quot; (context menu)
                  </li>
                  <li>&quot;Open all in new window&quot; (context menu)</li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Accessibility enhancements for dials, context menus, modals,
                    and the Settings page
                  </li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              {__FIREFOX__ && (
                <div>
                  <h2>Version 2.6.1</h2>
                  <h3>Resolved Issues</h3>
                  <ul>
                    <li>
                      Fixed bug that prevented the &quot;Open All in New
                      Tabs&quot; and &quot;Open All in New Window&quot; context
                      menu options from working.
                    </li>
                  </ul>
                </div>
              )}
              <div>
                <h2>Version 2.6</h2>
                <h3>New features</h3>
                <ul>
                  <li>
                    The last opened folder in a tab is now remembered and
                    restored when using the browser Home button.
                  </li>
                </ul>
              </div>
              {__FIREFOX__ && (
                <div>
                  <h2>Version 2.5.1</h2>
                  <h3>Resolved Issues</h3>
                  <ul>
                    <li>Minor bug fixes</li>
                  </ul>
                </div>
              )}
              <div>
                <h2>Version 2.5</h2>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                  <li>Minor performance enhancements</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.4.2</h2>
                <h3>Changes</h3>
                <ul>
                  <li>
                    The title is now centered when using the option Switch Title
                    and URL.
                  </li>
                </ul>
              </div>
              <div>
                <h2>Version 2.4</h2>
                <h3>New features</h3>
                <ul>
                  <li>Added option to attach title to dial</li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Replaced Desert Day and Desert Night wallpapers with Dunes
                    Day and Dunes Night wallpapers.
                  </li>
                  <li>
                    Replaced custom scrollbars with native browser scrollbars.
                  </li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.3</h2>
                <h3>New features</h3>
                <ul>
                  <li>Added option to hide title</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.2</h2>
                <h3>Changes</h3>
                <ul>
                  <li>Changed layout of Settings screen</li>
                  <li>Added new background images in Settings</li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.1</h2>
                <h3>Changes</h3>
                <ul>
                  <li>
                    Added context menu for &quot;Open in background tab&quot;
                  </li>
                  <li>Added Desert Night wallpaper</li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                  <li>Minor performance enhancements</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.0.2</h2>
                <h3>Changes</h3>
                <ul>
                  <li>Tweaked dial colors for many popular websites</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.0.1</h2>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
              <div>
                <h2>Version 2.0</h2>
                <h3>New features</h3>
                <ul>
                  <li>Custom background colors and images</li>
                  <li>Custom context menu for folders and bookmarks</li>
                  <li>Delete bookmark or folder from context menu</li>
                  <li>Open all bookmarks in folder from context menu</li>
                  <li>Option to set maximum number of columns</li>
                  <li>Option to use title in dial</li>
                </ul>
                <h3>Changes</h3>
                <ul>
                  <li>Added new background colors and images in Settings</li>
                  <li>Accessibility enhancements to improve contrast</li>
                  <li>Back and forward browser buttons now work</li>
                  <li>UI changes in Settings</li>
                </ul>
                <h3>Resolved Issues</h3>
                <ul>
                  <li>Minor bug fixes</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
