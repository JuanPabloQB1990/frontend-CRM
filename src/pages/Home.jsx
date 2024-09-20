'use client';
import { Chart } from 'primereact/chart'
import Layout from '../layout/layout'
import {  useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';
import useOrder from '../hooks/useOrder';
import useUser from '../hooks/useUser';
import useProduct from '../hooks/useProduct';

const Home = () => {

  const [options, setOptions] = useState({});
  const [data, setChartData] = useState({});
  const [products, setProducts] = useState([]);

  
  const { layoutConfig } = useContext(LayoutContext);

  const { countOrdersMonths, quantityOrderMonth, getOrders, quantityOrders } = useOrder()
  const { getProducts } = useProduct()
  const { auth, clients } = useUser() 

  const monthsOrders = []

  for (let index = 0; index < quantityOrderMonth.length; index++) {

    const element = quantityOrderMonth[index].fecha;
    const date = new Date(element);
    
    monthsOrders[date.getMonth()] = quantityOrderMonth[index].cantidad
    
  }
  
  // Obtener la fecha actual
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); 
  const currentYear = currentDate.getFullYear(); 
  
  // Array con los nombres de los meses
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const monthPassed = []
    
    for (let i = 0; i <= currentMonth; i++) {
      monthPassed.push(months[i]);
    }

    const countOrders = async(auth, currentMonth, currentYear) => {
      await countOrdersMonths(auth.token, currentMonth + 1, currentYear)
    }
    
    useEffect(() => {
      countOrders(auth, currentMonth, currentYear)
      getOrders(auth.token)
      getProducts(auth.token).then((data) => setProducts(data))
    }, []);
    
    useEffect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';
      
      
      if (quantityOrderMonth.length > 0) {
        const barData = {
          labels: monthPassed,
          datasets: [
              {
                  label: 'Ordenes',
                  backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                  borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                  data: monthsOrders
              }
          ]
        };
  
    
        const barOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary,
                      font: {
                          weight: '500'
                      }
                  },
                  grid: {
                      display: false
                  },
                  border: {
                      display: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  },
                  border: {
                      display: false
                  }
              }
          }
        };
    
        setOptions({
          barOptions
        });
        
        setChartData({
          barData
        });
        
      }
    
  }, [layoutConfig, quantityOrderMonth]);


  return (
    <Layout>
      <div className='grid'>
        <div className="col-12 lg:col-6 xl:col-4">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Ordenes</span>
                <div className="text-900 font-medium text-xl">{quantityOrders}</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
              </div>
            </div>
              <span className="text-green-500 font-medium">24 new </span>
              <span className="text-500">since last visit</span>
          </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-4">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Productos</span>
                <div className="text-900 font-medium text-xl">{products.length}</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-map-marker text-orange-500 text-xl" />
              </div>
            </div>
              <span className="text-green-500 font-medium">%52+ </span>
              <span className="text-500">since last week</span>
          </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-4">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Clientes</span>
                <div className="text-900 font-medium text-xl">{clients.length}</div>
              </div>
              <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-map-marker text-orange-500 text-xl" />
              </div>
            </div>
              <span className="text-green-500 font-medium">%52+ </span>
              <span className="text-500">since last week</span>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <h5>Bar Chart</h5>
            <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
