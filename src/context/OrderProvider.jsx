import { createContext, useEffect, useState } from 'react'

export const OrderContext = createContext()

const OrderProvider = ({children}) => {

    const [visible, setVisible] = useState(false);
    const [clientOrder, setClientOrder] = useState({});
    const [orderProducts, setOrderProducts] = useState([]);
    const [quantityOrderMonth, setQuantityOrderMonth] = useState([]);
    const [quantityOrders, setQuantityOrders] = useState(0)

    const saveOrder = async(order, token) => {
        
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(order)
        };

        try {
            const res = await fetch("http://localhost:4000/orders", options);
            const data = await res.json();
             
            setOrderProducts([])
            setClientOrder({})
            localStorage.removeItem("clientOrder");
            await getOrders(token)
            return data

        } catch (error) {
            console.log(error);
        }
    }

    const getOrders = async(token) => {
        
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: token }
        };

        try {
            const res = await fetch("http://localhost:4000/orders", options);
            const data = await res.json();
            
            setQuantityOrders(data.length)
        } catch (error) {
            console.log(error);
        }
    }

    const saveOrderProduct = async(orderProduct, token) => {

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(orderProduct)
        };

        try {
            const res = await fetch("http://localhost:4000/orders/product", options);
            return res
        } catch (error) {
            console.log(error);
        }
    }

    const getProductsOrder = async(token) => {

      if (localStorage.getItem("clientOrder")) {
        const clientOrder = JSON.parse(localStorage.getItem("clientOrder"))
        
        const options = {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token }
        };
  
        try {
            const res = await fetch(`http://localhost:4000/orders/products/${clientOrder.id}`, options);
            const data = await res.json(res)
            
            if (res.status === 200) {
              setOrderProducts(data);
            }
            
            
  
        } catch (error) {
            console.log(error);
        }
        
      }
    }
    
    const updateQuantityOrder = async(token, postUpdateOrder) => {

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(postUpdateOrder)
      };

      try {
        await fetch(`http://localhost:4000/orders/products`, options);
         
      } catch (error) {
          console.log(error);
      }
    }

    const deleteProductOrder = async(token, productOrder) => {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(productOrder)
      };

      try {
        const res = await fetch(`http://localhost:4000/orders/products`, options);
        
        return res
      } catch (error) {
          console.log(error);
      }
    }
    
    const handleModal = (modal) => {
      setVisible(modal)
        
    }
    
    const handleClientOrder = async(auth, client) => {

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: auth.token },
        body: JSON.stringify(client)
      };

      try {
          await fetch(`http://localhost:4000/orders/client/${auth.id}`, options);

      } catch (error) {
          console.log(error);
      }
      
      localStorage.setItem("clientOrder", JSON.stringify(client))
      setClientOrder(client)
       
    }

    useEffect(() => {

      const getClientOrder = async() => {
        const clientOrder = JSON.parse(localStorage.getItem("clientOrder"))
        setClientOrder(clientOrder)
      }
      
      getClientOrder()
      
    }, []);

    const countOrdersMonths = async(token, currentMonth, currentYear) => {
      
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ currentMonth, currentYear })
      };

      try {
        const res = await fetch(`http://localhost:4000/orders/counts`, options);
        const data = await res.json();
        
        
        const quantity = []
        
        for (let index = 0; index < data.length; index++) {
          
          quantity.push(data[index].cantidad)
        }
        
        setQuantityOrderMonth(data)
          
      } catch (error) {
          console.log(error);
      }

    }
  

  return (
    <OrderContext.Provider value={{saveOrder, handleModal, visible, setOrderProducts, handleClientOrder, clientOrder, saveOrderProduct, getProductsOrder, orderProducts, updateQuantityOrder, deleteProductOrder, countOrdersMonths, quantityOrderMonth, getOrders, quantityOrders}}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider
