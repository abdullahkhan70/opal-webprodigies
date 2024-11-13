import useCreateWorkspace from "@/hooks/useCreateWorkspace";
import React from "react";

type Props = {};

const WorkspaceForm = (props: Props) => {
  const { errors, isPending, onFormSubmit, register, reset, watch } =
    useCreateWorkspace();
  return <div>WorkspaceForm</div>;
};

export default WorkspaceForm;
