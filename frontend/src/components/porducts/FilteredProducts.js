
"use client";

import ReactPaginate from "react-paginate";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../shared/Card";
import {
  useGetFilteredProductsMutation,
} from "@/services/product/productApi";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../shared/skeletonLoading/ProductCard";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { setBrand, setCategory, setStore } from "@/features/filter/filterSlice";

const FilteredProducts = () => {
  const filter = useSelector((state) => state.filter);
  const [
    addFilter,
    { data: productsData, error: productsError, isLoading: productsLoading },
  ] = useGetFilteredProductsMutation();
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const itemsPerPage = 6;

  const [sortOption, setSortOption] = useState(""); // State for sort option

  const products = useMemo(() => productsData?.data || [], [productsData]);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const store = searchParams.get("store");

  useEffect(() => {
    // Fetch products with the current filter and page
    const queryParams = new URLSearchParams({
      ...filter,
      page: currentPage + 1, // ReactPaginate uses zero-based index, API expects 1-based
    }).toString();

    addFilter(queryParams);
  }, [filter, addFilter, currentPage]);

  useEffect(() => {
    // if (productsLoading) {
    //   toast.loading("Loading...", {
    //     id: "filtered-products",
    //   });
    // }

    // if (productsData) {
    //   toast.success(productsData?.description, {
    //     id: "filtered-products",
    //   });
    //   setTotalPages(productsData?.totalPages || 1); // Update total pages
    // }

    if (productsError?.data) {
      toast.error(productsError?.data?.description, {
        id: "filtered-products",
      });
    }

    if (brand) dispatch(setBrand(brand));
    if (category) dispatch(setCategory(category));
    if (store) dispatch(setStore(store));
  }, [
    productsError,
    productsData,
    productsLoading,
    brand,
    category,
    store,
    dispatch,
  ]);

  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Sort the products based on the selected option
  const sortedProducts = useMemo(() => {
    if (!sortOption) return allProducts;

    return [...allProducts].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "createdAt-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "createdAt-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  }, [allProducts, sortOption]);

  // Paginate the sorted products
  const displayedProducts = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    // Fetch all products on initial render
    const queryParams = new URLSearchParams(filter).toString();
    addFilter(queryParams);
  }, [filter, addFilter]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Update the sort option state
  };

  return (
      <div className="lg:col-span-9 md:col-span-8 col-span-12">

        <div className="flex justify-between items-center mb-4">
          {/* Sort Dropdown */}
          <div>
            <label htmlFor="sort" className="mr-2 font-medium">
              Sort By:
            </label>
            <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="p-2 border rounded"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="createdAt-asc">Newest</option>
              <option value="createdAt-desc">Oldest</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-y-8">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-6 gap-y-8">
            {productsLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                      <ProductCard key={index}/>
                  ))}
                </>
            ) : (
                <>
                  {displayedProducts.map((product, index) => (
                      <Card key={index} product={product}/>
                  ))}
                </>
            )}
          </div>
          {!productsLoading && displayedProducts?.length === 0 && (
              <p className="text-center">Oops! No products found!</p>
          )}
        </div>

        {/* React Paginate */}
        <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={Math.ceil(allProducts.length / itemsPerPage)}
            previousLabel="< previous"
            pageClassName="inline-block mx-1"
            pageLinkClassName="px-3 py-2 text-blue-600 border border-gray-300 rounded hover:bg-gray-100 hover:text-blue-700"
            previousClassName="inline-block mx-1"
            previousLinkClassName="px-3 py-2 text-blue-600 border border-gray-300 rounded hover:bg-gray-100 hover:text-blue-700"
            nextClassName="inline-block mx-1"
            nextLinkClassName="px-3 py-2 text-blue-600 border border-gray-300 rounded hover:bg-gray-100 hover:text-blue-700"
            breakLabel="..."
            breakClassName="inline-block mx-1"
            breakLinkClassName="px-3 py-2 text-gray-500 border border-gray-300 rounded"
            containerClassName="flex justify-center mt-4"
            activeClassName="bg-green-600"
        />

      </div>
  );
};

export default FilteredProducts;

