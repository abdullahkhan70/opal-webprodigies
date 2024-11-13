import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import { User } from "lucide-react";
import React from "react";
import Loader from "../loader";

type Props = {
  workspaceId: string;
};

const Search = (props: Props) => {
  const { isFetching, onSearchQuery, onUsers, query } = useSearch(
    "get-users",
    "USERS"
  );

  // WIP: Wire up sending invitation.
  // const {mutate, isPending} = useMutationData(['invite-member'], (data: {receiverId: string; email: string}) => {
  // })

  return (
    <div className="flex flex-col gap-y-5">
      <input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none px-3"
        placeholder="Search for your user..."
        type="text"
      />
      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        <div>
          {onUsers?.map((user) => {
            return (
              <div
                key={user.id}
                className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl"
              >
                <Avatar>
                  <AvatarImage src={user.image as string} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-lg capitalize">
                    {user?.firstname} {user?.lastname}
                  </h3>
                  <p className="lowercase text-sm bg-white px-2 rounded-lg text-[#1e1e1e]">
                    {user?.subscription?.plan}
                  </p>
                </div>
                <div className="flex-1 flex justify-end items-center">
                  <Button
                    onClick={() => {}}
                    variant={"default"}
                    className="w-5/12 font-bold"
                  >
                    <Loader state={true} color="#000">
                      Invite
                    </Loader>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
