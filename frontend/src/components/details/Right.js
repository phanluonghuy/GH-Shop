

import React from "react";
import { AiFillStar } from "react-icons/ai";
import CartButton from "./CartButton";
import Description from "./Description";
import Policies from "./Policies";

const Right = ({ product }) => {
  return (
    <section className="lg:col-span-6 md:col-span-6 col-span-12 flex flex-col gap-y-8">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h1 className="lg:text-5xl md:text-3xl text-xl">{product?.title}</h1>
          <p className="flex flex-row items-center gap-x-2">
            <span className="flex items-center border-2 border-green-500 rounded-primary py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium">
              <span className="text-green-500 !leading-none">
                ${product.price}.00
              </span>
            </span>
            <div className="border-l h-7 rounded" />

            <span className="text-xs flex items-center gap-x-1 px-2 h-full bg-zinc-50 rounded">
              <AiFillStar className="w-4 h-4 text-yellow-500" /> {product?.reviews?.length}
            </span>
          </p>
        </div>
        <CartButton product={product} />
      </article>
      <Description product={product} />
      <Policies />
      {/* Displaying stock information */}
      <div className="flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold">Stock Availability</h2>
        <ul>
          {product?.stock?.variations?.map((variation) => (
              <li key={variation._id.$oid} className="flex justify-between">
                <span>{variation.color} - {variation.size}</span>
                <span>{variation.quantity} units available</span>
              </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Right;
