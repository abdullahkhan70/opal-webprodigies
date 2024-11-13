"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  workspaceId?: string;
  userId?: string;
};

export const verifyAccessToWorkspace = async ({ workspaceId }: Props) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const isUserWorkspace = await client.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: { workspace: isUserWorkspace },
    };
  } catch (error) {
    return {
      status: 403,
      data: { workspace: null },
    };
  }
};

export const getWorkspaceFolders = async ({ workspaceId }: Props) => {
  try {
    const isFolders = await client.folders.findMany({
      where: {
        workSpaceId: workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (isFolders && isFolders?.length > 0)
      return { status: 200, data: isFolders };
    return { status: 404, data: null };
  } catch (error) {
    return { status: 403, data: error };
  }
};

export const getAllUserVideos = async ({ workspaceId }: Props) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const videos = await client.videos.findMany({
      where: {
        OR: [{ workSpaceId: workspaceId }, { folderId: workspaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (videos) return { status: 200, data: videos };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: error };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            Workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) return { status: 200, data: workspaces };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: error };
  }
};

export const createWorkspace = async (name: any) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client?.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });
      if (workspace) {
        return { status: 201, data: "Workspace Created" };
      }
    }
    return {
      status: 403,
      data: "You are not authorized to create a workspace...",
    };
  } catch (error) {
    return { status: 403, data: error };
  }
};
