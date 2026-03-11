// Re-export everything from the modularised sub-folder.
// Any existing imports such as:
//   import { FilterSidebar, FilterState, defaultFilterState } from "~/components/features/search/filter-sidebar"
// continue to work unchanged.

export type { FilterSidebarProps, FilterState } from "./filter-sidebar/index";
export {
  defaultFilterState,
  FilterSidebar,
} from "./filter-sidebar/index";
