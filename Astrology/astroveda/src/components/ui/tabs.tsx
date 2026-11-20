'use client';

import { useState, type ReactNode, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType>({ activeTab: '', setActiveTab: () => {} });

export interface TabsProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div role="tablist" className={`flex gap-2 border-b border-cosmic/20 ${className}`}>
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabTrigger({ value, children, className = '' }: TabTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`
        px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer
        border-b-2 -mb-px min-h-[44px]
        ${isActive
          ? 'border-action text-action bg-action/5 rounded-t-lg'
          : 'border-transparent text-midnight/60 hover:text-midnight hover:border-cosmic/30'}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}

export interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabContent({ value, children, className = '' }: TabContentProps) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return (
    <div role="tabpanel" className={`pt-4 animate-in fade-in-50 duration-200 ${className}`}>
      {children}
    </div>
  );
}

