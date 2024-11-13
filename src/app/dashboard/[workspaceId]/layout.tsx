import { getNotifications, onAuthenticateUser } from "@/app/actions/user";
import {
  getAllUserVideos,
  getWorkSpaces,
  getWorkspaceFolders,
  verifyAccessToWorkspace,
} from "@/app/actions/workspace";
import { redirect } from "next/navigation";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";
import SideBar from "@/components/global/Sidebar";
import GlobalHeader from "@/components/global/global-header";

type Props = {
  params: { workspaceId: string };
  children: React.ReactNode;
};

const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user?.workspace.length) redirect("/auth/sign-in");
  const hasAccess = await verifyAccessToWorkspace({ workspaceId: workspaceId });

  if (hasAccess.status !== 200)
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  if (!hasAccess.data?.workspace) return null;

  // pre-fecthing and Cache the workspace data using react-query.
  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders({ workspaceId }),
  });

  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos({ workspaceId }),
  });

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <SideBar actionWorkSpaceId={workspaceId} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess?.data?.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
