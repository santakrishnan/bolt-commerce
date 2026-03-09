// Feature toggles for experimental UI
// Add new toggles here as needed

export const FEATURE_TOGGLES = {
  featuresTableView: true, // Set to false to disable new FeaturesDisplay table view
};

export type FeatureToggleKey = keyof typeof FEATURE_TOGGLES;

export function isFeatureEnabled(key: FeatureToggleKey): boolean {
  return FEATURE_TOGGLES[key];
}
