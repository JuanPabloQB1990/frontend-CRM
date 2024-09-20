import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Button } from "primereact/button";
import { DataScroller } from "primereact/datascroller";
import { Card } from "primereact/card";
import Layout from "../layout/layout";
import { InputNumber } from "primereact/inputnumber";
import useUser from "../hooks/useUser";
import useOrder from "../hooks/useOrder";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function OrderProducts() {
  const [submmit, setSubmmit] = useState(false);
  const [priceTotal, setPriceTotal] = useState(0);
  
  const { auth } = useUser()
  const toast = useRef(null);

  //const navigate = Navigate()

  const { saveOrder, clientOrder, getProductsOrder, orderProducts, updateQuantityOrder, deleteProductOrder, setOrderProducts } = useOrder()
  
  const ds = useRef(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    getProductsOrder(auth.token)
    
  }, [submmit, auth.token]);

  const handlerQuantity = async(valueQuantity, id) => {
    setSubmmit(true);

    const postUpdateOrder = {
      id_client: JSON.parse(localStorage.getItem("clientOrder")).id,
      id_product: id,
      quantity: valueQuantity
    }

    await updateQuantityOrder(auth.token, postUpdateOrder)
    getProductsOrder(auth.token)
    sumTotalProducts()
    setSubmmit(true);
    
  };

  const handleDelete = async (id) => {
    setSubmmit(true);

    const productOrder = {
      id_client: JSON.parse(localStorage.getItem("clientOrder")).id,
      id_product: id
    }

    await deleteProductOrder(auth.token, productOrder)
    
    if (orderProducts.length > 1) {
      getProductsOrder(auth.token)
      setSubmmit(true);
      sumTotalProducts()
      
    }else{
      setOrderProducts([])
    }
   
  };
  
  // funcion para calcular el resultado de todos los productos a comprar
  const sumTotalProducts = useCallback(() => {
    const totalProducts = orderProducts?.reduce((acc, prod) => {
      return acc + prod.price * prod.quantityOrder;
    }, 0);

    setPriceTotal(totalProducts);
  }, [orderProducts]);
  
  useEffect(() => {
    sumTotalProducts();
  }, [sumTotalProducts, submmit]);

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };
  
  
  const onSubmitOrder = async(e) => {
    e.preventDefault();

    const objectProductOrder = []

    const orderProduct = {}

    const colombiaOffset = -5 * 60; 
    const now = new Date();
    const localTime = new Date(now.getTime() + (colombiaOffset * 60 * 1000));

    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    const hours = String(localTime.getUTCHours()).padStart(2, '0');
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(localTime.getUTCSeconds()).padStart(2, '0');
    const fecha = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    orderProducts.map(op => {
      orderProduct["id"] = op.id
      orderProduct["name"] = op.name
      orderProduct["price"] = op.price
      orderProduct["quantity"] = op.quantityOrder
      orderProduct["description"] = op.description

      objectProductOrder.push(orderProduct)

    })

    const postOrderProducts = {
      fecha: fecha,
      id_client: JSON.parse(localStorage.getItem("clientOrder")).id,
      id_admin: auth.id,
      total: priceTotal,
      products: objectProductOrder
    }
    
    const data = await saveOrder(postOrderProducts, auth.token);
    
    console.log(data);
            
    toast.current.show({ severity: 'success', summary: data.message, detail: "satisfactoriamente", life: 3000 });
    navigate("/")
  };

  const itemTemplate = (data) => {
    
    return (
      <div className="flex flex-column w-full lg:flex-row lg:align-items-start p-4 gap-4">
        <div className="flex flex-column md:flex-row justify-content-between align-items-center xl:align-items-start md:flex-1 gap-4">
          <div className="flex flex-row justify-content-around w-full md:flex-column align-items-center md:align-items-start gap-3">
            <div className="flex flex-column gap-1">
              <div className="text-2xl font-bold text-900">{data.name}</div>
            </div>
            <div className="flex flex-column gap-2">
              <span className="flex align-items-center gap-2">
                <i className="pi pi-tag product-category-icon"></i>
                <span className="font-semibold">{data.description}</span>
              </span>
              <div className="text-2xl font-bold text-900">
                {formatCurrency(data.price * data.quantityOrder) }
              </div>
            </div>
          </div>
          <div className="flex flex-column justify-content-around w-full md:flex-column md:align-items-end gap-4 md:gap-2">
            <Button
              onClick={() => handleDelete(data.id)}
              icon="pi pi-trash"
              severity="danger"
              label="Delete"
              className="w-full md:max-w-8rem"
            />
            <InputNumber
              value={data.quantityOrder}
              onValueChange={(e) => handlerQuantity(e.value, data.id)}
              mode="decimal"
              showButtons
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    );
  };

  const footer = (
    <Button
      type="text"
      icon="pi pi-plus"
      label="Load"
      onClick={() => ds.current.load()}
    />
  );

  return (
    <Layout>
      <Toast ref={toast} />
      
      <div className="flex flex-column md:flex-row md:justify-content-between md:gap-4 h-screen w-full">
        <div className="md:w-3 h-20rem">
          <Card title="Resumen de Compra">
            <div className="flex flex-row justify-content-between mt-2">
              <p className="">Productos: </p>
              <p className="">{orderProducts?.length}</p>

            </div>
            <div className="flex flex-row justify-content-between mt-2">
              <p>Total: </p>
              <p>{formatCurrency(priceTotal)}</p>
            </div>
            {clientOrder.name ? (
              <div className="flex flex-row justify-content-between mt-2">
                <p>Nombre cliente: </p>
                <p>{clientOrder.name}</p>
              </div>

            ) : null}
            <Button
              className="w-full"
              label="Guardar Orden"
              raised
              onClick={onSubmitOrder}
            />
          </Card>
        </div>
        <div className="md:w-9">
          <DataScroller
            value={orderProducts}
            itemTemplate={itemTemplate}
            rows={5}
            loader
            footer={footer}
            scrollHeight="700px"
            header="Orden de Productos"
          />
        </div>
      </div>
    </Layout>
  );
}
