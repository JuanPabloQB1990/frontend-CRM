import { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import verifyTokenExpired from '../helpers/verifyTokenExpired';

export default function AppMenu() {

    const toast = useRef(null);
    const navigate = useNavigate();
    const { auth } = useUser()

    const items = [
        
        {
            label: 'Profile',
            items: [ 
                
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    visible: verifyTokenExpired(auth.token) ? true : false,
                    command: () => {
                        localStorage.removeItem('authentication')
                        navigate("/login")
                    }
                },
                {
                    label: 'Products',
                    icon: 'pi pi-plus',
                    visible: auth.rol === import.meta.env.VITE_ROL_ADMIN.toLowerCase() ? true : false,
                    command: () => {
                        navigate("/admin-products")
                    }

                },
                {
                    label: 'Users',
                    icon: 'pi pi-user',
                    visible: auth.rol === import.meta.env.VITE_ROL_ADMIN.toLowerCase() ? true : false,
                    command: () => {
                        navigate("/admin-clients")
                    }

                },
                {
                    label: 'Orders',
                    icon: 'pi pi-user',
                    visible: auth.rol === import.meta.env.VITE_ROL_ADMIN.toLowerCase() ? true : false,
                    command: () => {
                        navigate("/admin-orders")
                    }

                }
            ]
        }
    ];

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast} />
            <Menu model={items} />
        </div>
    )
}
        
        
