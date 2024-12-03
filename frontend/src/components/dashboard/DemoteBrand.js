import React, { useEffect } from "react";
import Trash from "../icons/Trash";
import { useUpdateBrandMutation } from "@/services/brand/brandApi";
import Spinner from "../shared/Spinner";

const DemoteBrand = ({ brand }) => {
  const [
    updateBrand,
    {
      isLoading: brandUpdating,
      data: updateBrandResponse,
      error: updateBrandResponseError,
    },
  ] = useUpdateBrandMutation();

  useEffect(() => {
    if (updateBrandResponse) {
      alert(updateBrandResponse?.description);
    }
    if (updateBrandResponseError?.data) {
      alert(updateBrandResponseError?.data?.description);
    }
  }, [updateBrandResponse, updateBrandResponseError]);

  return (
    <button
      className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
      onClick={() => updateBrand({ id: brand?._id, body: { trashable: true } })}
    >
      {brandUpdating ? <Spinner /> : <Trash />}
    </button>
  );
};

export default DemoteBrand;
