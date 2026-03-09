/**
 * Flags Discovery Endpoint
 *
 * This endpoint enables the Vercel Flags Explorer integration.
 * It exposes flag metadata for the Vercel toolbar to discover and override flags.
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags/flags-explorer
 */

import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import * as flags from "~/lib/flags/flags";
import * as vdpFlags from "~/lib/flags/vdp-flags";

export const GET = createFlagsDiscoveryEndpoint(() => {
  return getProviderData({ ...flags, ...vdpFlags });
});
