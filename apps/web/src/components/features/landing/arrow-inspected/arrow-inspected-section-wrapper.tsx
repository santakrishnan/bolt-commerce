import { getInspectionFeatures } from "~/lib/data";
import { ArrowInspectedSection } from "./arrow-inspected-section";

export interface ArrowInspectedSectionWrapperProps {
  carouselClassName?: string;
  className?: string;
  containerClassName?: string;
  description?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  headerClassName?: string;
  title?: string;
  titleClassName?: string;
}

export async function ArrowInspectedSectionWrapper(props: ArrowInspectedSectionWrapperProps) {
  const inspectionFeatures = await getInspectionFeatures();

  if (!inspectionFeatures || inspectionFeatures.length === 0) {
    return null;
  }

  return <ArrowInspectedSection inspectionFeatures={inspectionFeatures} {...props} />;
}
