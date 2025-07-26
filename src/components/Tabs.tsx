import { createContext, use, useEffect, useRef } from "react";

const TabsContext = createContext();

export function Tabs({ selectedTab, setSelectedTab, children, ...props }) {
  const tabsRef = useRef();
  const tabs = useRef([]);

  const getTabIndex = () => {
    if (!tabsRef.current) return -1;

    return tabs.current.findIndex((tab) => tab.textContent === selectedTab);
  };

  useEffect(() => {
    tabs.current = [...(tabsRef.current?.querySelectorAll("button") || [])];
  }, []);

  function handleKeyDown(e) {
    const currIndex = getTabIndex();
    const isFirstItem = currIndex === 0;
    const isLastItem = currIndex === tabs.current.length - 1;

    const focus = {
      firstItem: () => {
        setSelectedTab(tabs.current[0].textContent);
        tabs.current[0].focus();
      },
      lastItem: () => {
        const newIndex = tabs.current.length - 1;
        setSelectedTab(tabs.current[newIndex].textContent);
        tabs.current[newIndex].focus();
      },
      previousItem: () => {
        const newIndex = isFirstItem ? tabs.current.length - 1 : currIndex - 1;
        setSelectedTab(tabs.current[newIndex].textContent);
        tabs.current[newIndex].focus();
      },
      nextItem: () => {
        const newIndex = isLastItem ? 0 : currIndex + 1;
        setSelectedTab(tabs.current[newIndex].textContent);
        tabs.current[newIndex].focus();
      },
    };

    const keys = {
      ArrowLeft: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.previousItem();
      },
      ArrowRight: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.nextItem();
      },
      Home: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.firstItem();
      },
      End: () => {
        e.preventDefault();
        e.stopPropagation();
        focus.lastItem();
      },
    };

    if (keys[e.key]) {
      keys[e.key]();
    }
  }

  return (
    <TabsContext.Provider
      value={{ handleKeyDown, selectedTab, setSelectedTab }}
    >
      <div ref={tabsRef} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, ...props }) {
  return (
    <div role="tablist" {...props}>
      {children}
    </div>
  );
}

export function Tab({ value, children, ...props }) {
  const { handleKeyDown, selectedTab, setSelectedTab } = use(TabsContext);

  return (
    <button
      type="button"
      role="tab"
      aria-controls={`${value}-tabpanel`}
      aria-selected={selectedTab === value}
      onClick={() => setSelectedTab(value)}
      data-value={value}
      tabIndex={selectedTab === value ? null : -1}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children, ...props }) {
  const { selectedTab } = use(TabsContext);

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      style={{
        display: selectedTab === value ? null : "none",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
