import { useState, useEffect } from "react";

export type IntegrationStatus = "connected" | "disconnected" | "expired";

export interface FieldMapping {
  id: string;
  sourceFields: string[];
  targetField: string;
  defaultValue?: string;
}

export interface IntegrationData {
  id: string;
  status: IntegrationStatus;
  mappings: FieldMapping[];
  lastSync?: string;
  enabled?: boolean;
}

const STORAGE_KEY = "sakneen_integrations_v1";

export const useIntegrationStore = () => {
  const [integrations, setIntegrations] = useState<Record<string, IntegrationData>>({});

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setIntegrations(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse integrations", e);
      }
    }
  }, []);

  // Save to local storage whenever integrations change
  const saveToStorage = (newData: Record<string, IntegrationData>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setIntegrations(newData);
  };

  const updateIntegration = (id: string, data: Partial<IntegrationData>) => {
    const current = integrations[id] || { id, status: "disconnected", mappings: [], enabled: true };
    const updated = { ...current, ...data };
    saveToStorage({
      ...integrations,
      [id]: updated,
    });
  };

  const getIntegration = (id: string) => {
    return integrations[id] || { id, status: "disconnected", mappings: [], enabled: true };
  };

  const disconnectIntegration = (id: string) => {
    const { [id]: removed, ...rest } = integrations;
    saveToStorage(rest);
  };

  return {
    integrations,
    updateIntegration,
    getIntegration,
    disconnectIntegration,
  };
};
