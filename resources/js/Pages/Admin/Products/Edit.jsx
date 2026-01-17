import CreateProduct from "./Create";

export default function EditProduct({ product }) {
    // The Create component will be reused with product prop for editing
    return <CreateProduct product={product} />;
}
