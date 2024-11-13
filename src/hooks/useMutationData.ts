import {
  MutateFunction,
  MutationKey,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
  MutationKey: MutationKey,
  mutationFunction: MutateFunction<any, any>,
  queryKey?: QueryKey,
  onSuccess?: () => void
) => {
  const client = useQueryClient();
  const { mutate, isPending} = useMutation({
    mutationKey: MutationKey,
    mutationFn: mutationFunction,
    onSuccess(data) {
      if (onSuccess) onSuccess();
      return toast(data?.status === 200 ? "Success" : "Error", {description: data?.data});
    },
    onSettled:async () => {
        return await client.invalidateQueries({queryKey: [queryKey]})
    }
  });

  return {mutate, isPending}
};
