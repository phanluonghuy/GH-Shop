"use client";

import React, { useEffect } from "react";
import Trash from "../icons/Trash";
import Spinner from "../shared/Spinner";
import { useUpdateCategoryMutation } from "@/services/category/categoryApi";

const DemoteCategory = ({ category }) => {
  const [
    updateCategory,
    {
      isLoading: categoryUpdating,
      data: updateCategoryResponse,
      error: updateCategoryResponseError,
    },
  ] = useUpdateCategoryMutation();

  useEffect(() => {
    if (updateCategoryResponse) {
      alert(updateCategoryResponse?.description);
    }
    if (updateCategoryResponseError?.data) {
      alert(updateCategoryResponseError?.data?.description);
    }
  }, [updateCategoryResponse, updateCategoryResponseError]);

  return (
    <button
      className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
      onClick={() =>
        updateCategory({ id: category?._id, body: { trashable: true } })
      }
    >
      {categoryUpdating ? <Spinner /> : <Trash />}
    </button>
  );
};

export default DemoteCategory;
