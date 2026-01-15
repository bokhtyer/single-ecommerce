import { useState } from "react";

export default function Home({ product }) {
    const [addCard, setAddCard] = useState(false);
    return (
        <div className="p-10 bg-white body-font">
            <h1 className="text-4xl font-heading font-bold mb-4 text-dark">
                {product.name}
            </h1>
            <p className="mb-4 text-base text-gray leading-relaxed">
                {product.description}
            </p>
            <p className="text-2xl font-semibold mb-6 text-primary">
                ${product.price}
            </p>
            <button
                onClick={() => setAddCard(!addCard)}
                className="bg-primary hover:bg-secondary text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
                {addCard ? "Remove from Cart" : "Add to Cart"}
            </button>
        </div>
    );
}
