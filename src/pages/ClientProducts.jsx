import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import Layout from "../layout/layout.jsx";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import useProduct from "../hooks/useProduct.js";
import useUser from "../hooks/useUser.js";
import { AutoComplete } from "primereact/autocomplete";
import { Toast } from "primereact/toast";

export default function BasicDemo() {
  const [product, setProduct] = useState({});
  const [layout, setLayout] = useState("grid");
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [productsFilter, setProductsFilter] = useState([]);
  const [valueQuantity, setValueQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [submmit, setSubmmit] = useState(false);

  const { id } = useParams();
  const toast = useRef(null);

  const { products, getProductsByCategory, addToCart, message, setMessage } = useProduct();
  const { auth } = useUser();

  useEffect(() => {
    if (message.type) {
      toast.current.show({
        severity: message.type,
        summary: message.title,
        detail: message.msg,
        life: 3000,
      });
      
    }

    setMessage({ title: "", msg: "", type: "" })
  }, [submmit]);
  
  const handleAddToCart = async(product) => {

    setSubmmit(true)

    const productToCart = {
        id_client: auth.id,
        id_product: product.id,
        quantity: valueQuantity,
        total: product.price
    }

    await addToCart(productToCart, auth.token)
    
    setSubmmit(false)

  }

  const searchSelect = () => {
    const arrQuantity = [];
    for (let index = 1; index < product.quantity + 1; index++) {
      arrQuantity.push(index);
    }

    setItems(arrQuantity);
  };

  useEffect(() => {
    getProductsByCategory(id, auth.token);
  }, [id, auth]);

  console.log(products);

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const showProduct = (product) => {
    setVisible(true);
    setProduct(product);
  };

  const formatCurrency = (value) => {
    return value?.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const defineInventoryStatus = (product) => {
    if (product.quantity < 10) {
      product["inventoryStatus"] = "OUTOFSTOCK";
      return "OUTOFSTOCK";
    }
    if (product.quantity < 20 && product.quantity >= 10) {
      product["inventoryStatus"] = "LOWSTOCK";
      return "LOWSTOCK";
    }
    if (product.quantity >= 20) {
      product["inventoryStatus"] = "INSTOCK";
      return "INSTOCK";
    }
  };

  const listItem = (product, index) => {

    
    return (
      <div className="col-12" key={product.id}>
        <div
          className={classNames(
            "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            style={{ minWidth: "160px", minHeight: "160px", objectFit: "contain"}}
            src={
              product.images
                ? `https://res.cloudinary.com/dtydggyis/image/upload/${
                    Object.values(product.images[0])[0]
                  }`
                : null
            }
            alt={product.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900 text-overflow-ellipsis">{product.name}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product.category}</span>
                </span>
                <Tag
                  value={defineInventoryStatus(product)}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">
                {formatCurrency(product.price)}
              </span>
              <Button
                onClick={() => showProduct(product)}
                icon="pi pi-search-plus"
                className="p-button-rounded"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product) => {
    return (
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2" key={product.id}>
        <div  className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{product.category}</span>
            </div>
            <Tag
              value={defineInventoryStatus(product)}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-8 md:w-6 shadow-2 border-round"
              style={{ minWidth: "160px", minHeight: "160px", objectFit: "contain"}}
              src={
                product.images
                  ? `https://res.cloudinary.com/dtydggyis/image/upload/${
                      Object.values(product.images[0])[0]
                    }`
                  : null
              }
              alt={product.name}
            />
            <div className="text-2xl font-bold text-overflow-ellipsis">{product.name}</div>
            <Rating value={product.rating} readOnly cancel={false}></Rating>
          </div>
          <div className="w-full flex align-items-center gap-2 mr-2 justify-content-between">
            <span className="text-2xl font-semibold">
              {formatCurrency(product.price)}
            </span>
            <Button
              onClick={() => showProduct(product)}
              icon="pi pi-search-plus"
              className="p-button-rounded"
              style={{minWidth:"42px"}}
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product, layout, index) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product, index);
    else if (layout === "grid") return gridItem(product);
  };

  const listTemplate = (products, layout) => {
    return (
      <div className="grid grid-nogutter p-4">
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const onInputSearch = (e) => {
    setSearch(e.target.value);
  };

  const header = () => {
    return (
      <div className="flex justify-content-between">
        <div>
          <InputText
            placeholder="Search"
            type="text"
            onChange={(e) => onInputSearch(e)}
          />
          <Button
            label="Search"
            className="mx-2"
            onClick={() => searchByName()}
          />
        </div>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  const searchByName = () => {
    const productsFiltered = products.filter((product) =>
      product.name.includes(search)
    );
    setProductsFilter(productsFiltered);
  };

  console.log(productsFilter);

  return (
    <Layout className="card">
      <Toast ref={toast} />
      <DataView
        value={productsFilter?.length > 0 ? productsFilter : products}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
        paginator
        rows={5}
      />
      <Dialog
        visible={visible}
        modal
        style={{ width: "70%", minHeight: "700px" }}
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-column md:flex-row">
          <GalleryImages product={product} />
          <div className="w-full md:w-6 p-4">
            <div className="flex justify-content-between align-items-center">
              <h2>{product.name}</h2>
              <p>codigo: {product.code}</p>
            </div>
            <Rating
              className="my-4"
              value={product.rating}
              readOnly
              cancel={false}
            ></Rating>
            <h5 className="">Descripcion</h5>
            <p className="mb-2">{product.description}</p>
            <h5>Categoria</h5>
            <p>{product.category}</p>
            <div className="flex justify-content-between align-items-center">
              <p className="w-6">
                {" "}
                <span className="text-lg font-semibold">stock:</span>{" "}
                {product.quantity}{" "}
                {product.quantity > 1 ? "unidades" : "unidad"}
              </p>
                <AutoComplete
                  className="w-6"
                  value={valueQuantity}
                  suggestions={items}
                  completeMethod={searchSelect}
                  onChange={(e) => setValueQuantity(e.value)}
                  dropdown
                />
            </div>
            <Tag
              value={product.inventoryStatus}
              severity={getSeverity(product)}
            ></Tag>
            <div className="flex justify-content-between align-items-center">
              <p className="font-semibold text-2xl my-4">
                {formatCurrency(product.price)}
              </p>
              <Button
                onClick={() => handleAddToCart(product)}
                icon="pi pi-shopping-cart"
                label="Add to Cart"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
                
              ></Button>
            </div>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
