import { getInspectionFeatures } from "~/lib/data";
import { ArrowInspectedSection } from "./arrow-inspected-section";

export interface ArrowInspectedSectionWrapperProps {
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  className?: string;
  carouselClassName?: string;
  gridClassName?: string;
  title?: string;
  description?: string;
}

export async function ArrowInspectedSectionWrapper(props: ArrowInspectedSectionWrapperProps) {
  const inspectionFeatures = await getInspectionFeatures();

  if (!inspectionFeatures || inspectionFeatures.length === 0) {
    return null;
  }

  return <ArrowInspectedSection inspectionFeatures={inspectionFeatures} {...props} />;
}
