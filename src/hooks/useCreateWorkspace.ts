import { createWorkspace } from "@/app/actions/workspace";
import { useMutationData } from "./useMutationData";
import useZodForm from "./useZodForm";
import { workspaceSchema } from "@/components/global/workspace-form/schema";

export const useCreateWorkspace = () => {
  const { mutate, isPending } = useMutationData(
    ["create-workspace"],
    (data: any) => createWorkspace(data?.name),
    ["user-workspaces"]
  );

  const { register, reset, watch, onFormSubmit, errors } = useZodForm({
    mutation: mutate,
    schema: workspaceSchema,
  });

  return {
    register,
    reset,
    watch,
    onFormSubmit,
    errors,
    isPending,
  };
};

export default useCreateWorkspace;
