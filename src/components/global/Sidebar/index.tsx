"use client";

import { v4 as uuidv4 } from "uuid";
import { getWorkSpaces } from "@/app/actions/workspace";
import { NotificationProps, WorkSpaceProps } from "@/app/types/index.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItems from "./sidebar-items";
import { getNotifications } from "@/app/actions/user";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import Loader from "../loader";
import { randomUUID } from "crypto";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";

type Props = {
  actionWorkSpaceId: string;
};

const SideBar = ({ actionWorkSpaceId }: Props) => {
  let uuid = uuidv4();
  const router = useRouter();
  const pathName = usePathname();

  const { data, isPending } = useQueryData(["user-workspaces"], getWorkSpaces);
  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  // console.log(`Active Workspace ID: ${actionWorkSpaceId}`)

  const { data: workSpaceData } = data as WorkSpaceProps;
  const { data: count } = notifications as NotificationProps;

  const currentWorkspace = workSpaceData?.workspace.find(
    (s) => s?.id === actionWorkSpaceId
  );
  const menuItems = MENU_ITEMS(actionWorkSpaceId);

  const SidebarSection = (
      <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-y-auto">
        <div className="bg-[#111111] p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 flex">
          <Image src={"/vercel.svg"} height={40} width={40} alt="logo" />
          <p className="text-2xl">Opal</p>
        </div>
        <Select
          onValueChange={onChangeActiveWorkspace}
          defaultValue={actionWorkSpaceId}
        >
          <SelectTrigger className="mt-16 text-neutral-400, bg-transparent">
            <SelectValue placeholder={"Select a Workspace"}></SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#111111] backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel>Menu</SelectLabel>
              <Separator />
              {workSpaceData?.workspace.map((workspace) => {
                return (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                );
              })}
              {workSpaceData?.members.length > 0 &&
                workSpaceData?.members.map(
                  (member) =>
                    member.Workspace && (
                      <SelectItem
                        key={member.Workspace.id}
                        value={member.Workspace.id}
                      >
                        {member.Workspace.name}
                      </SelectItem>
                    )
                )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {currentWorkspace?.type === "PUBLIC" &&
          workSpaceData?.subscription?.plan === "PRO" && (
            <Modal
              trigger={
                <span
                  className="text-sm cursor-pointer flex items-center
       justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2"
                >
                  <PlusCircle
                    size={15}
                    className="text-neutral-800/90 fill-neutral-500"
                  />
                  <span className="text-neutral-400 font-semibold text-xs">
                    Invite To Workspace
                  </span>
                </span>
              }
              title="Invite To Workspace"
              description="Invite other users to your workspace"
            >
              <Search workspaceId={actionWorkSpaceId} />
            </Modal>
          )}
        <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>

        <nav className="w-full">
          <ul key={uuid}>
            {menuItems?.map((menuItemData) => {
              return (
                <SidebarItems
                  href={menuItemData?.href}
                  icon={menuItemData?.icon}
                  title={menuItemData?.title}
                  selected={pathName === menuItemData?.href}
                  notifications={
                    (menuItemData?.title === "Notifications" &&
                      count._count &&
                      count._count.notification) ||
                    0
                  }
                />
              );
            })}
          </ul>
        </nav>
        <Separator className="w-4/5" />
        <p className="w-full text-[#9D9D9D] font-bold mt-2">Workspaces</p>
        {workSpaceData?.workspace?.length > 0 &&
          workSpaceData?.members?.length === 0 && (
            <div className="w-full h-full justify-center items-center">
              <p className="text-[#9D9D9D] font-medium text-sm">
                {workSpaceData?.subscription?.plan === "FREE"
                  ? "Upgrade to Create Workspace"
                  : "No Workspaces"}
              </p>
            </div>
          )}
        <nav className="w-full">
          <ul
            key={uuid}
            className="h-auto overflow-auto overflow-x-hidden fade-layer"
          >
            {workSpaceData?.workspace?.length > 0 &&
              workSpaceData?.workspace?.map(
                (item) =>
                  item?.type !== "PERSONAL" && (
                    <SidebarItems
                      href={`/dashboard/${item?.id}`}
                      selected={pathName === `/dashboard/${item?.id}`}
                      title={item?.name}
                      notifications={0}
                      key={item?.name}
                      icon={
                        <WorkspacePlaceholder key={item?.id}>
                          {item?.name.charAt(0)}
                        </WorkspacePlaceholder>
                      }
                    />
                  )
              )}

            {workSpaceData?.members?.length > 0 &&
              workSpaceData?.members?.map((item) => (
                <SidebarItems
                  href={`/dashboard/${item?.Workspace.id}`}
                  selected={pathName === `/dashboard/${item?.Workspace.id}`}
                  title={item?.Workspace.name}
                  notifications={0}
                  key={item?.Workspace.name}
                  icon={
                    <WorkspacePlaceholder key={item?.Workspace.id}>
                      {item?.Workspace.name.charAt(0)}
                    </WorkspacePlaceholder>
                  }
                />
              ))}
          </ul>
        </nav>
        <Separator className="w-4/5" />
        {workSpaceData?.subscription?.plan === "FREE" && (
          <GlobalCard
            title="Upgrade to Pro"
            description="Unlock AI features like description, AI summary, and more..."
            footer={
              <Button className="text-sm w-full mt-2">
                <Loader state={false}>Upgrade</Loader>
              </Button>
            }
          ></GlobalCard>
        )}
      </div> 
  );
  return (
    <div className="full">
      {/** INFOBAR */}

      <InfoBar />

      {/** Sheet mobile and desktop */}

      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="ml-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default SideBar;
