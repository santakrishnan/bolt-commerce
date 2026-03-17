import { redirect } from "next/navigation";
import { MyGarageWrapper } from "~/components/layout/my-garage";
import { getUserInfo } from "~/lib/flags/flags";
import { ROUTES } from "~/lib/routes/constants";

export default async function MyGaragePage() {
  // Only authenticated users can access this page
  const { isAuthenticated } = await getUserInfo();

  if (!isAuthenticated) {
    redirect(ROUTES.HOME);
  }

  return <MyGarageWrapper />;
}
