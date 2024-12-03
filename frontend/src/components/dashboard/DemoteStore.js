"use client";

import { useUpdateStoreMutation } from "@/services/store/storeApi";
import React, { useEffect } from "react";
import Trash from "../icons/Trash";
import Spinner from "../shared/Spinner";

const DemoteStore = ({ store }) => {
  const [
    updateStore,
    {
      isLoading: storeUpdating,
      data: updateStoreResponse,
      error: updateStoreResponseError,
    },
  ] = useUpdateStoreMutation();

  useEffect(() => {
    if (updateStoreResponse) {
      alert(updateStoreResponse?.description);
    }
    if (updateStoreResponseError?.data) {
      alert(updateStoreResponseError?.data?.description);
    }
  }, [updateStoreResponse, updateStoreResponseError]);

  return (
    <button
      className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
      onClick={() => updateStore({ id: store?._id, body: { trashable: true } })}
    >
      {storeUpdating ? <Spinner /> : <Trash />}
    </button>
  );
};

export default DemoteStore;
