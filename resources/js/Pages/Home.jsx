import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Home({ product }) {
    return (
        <div className="p-10">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-2">${product.price}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Buy Now
            </button>
        </div>
    );
}
