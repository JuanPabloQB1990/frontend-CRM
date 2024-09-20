import { useNavigate } from 'react-router-dom'
import verifyTokenExpired from '../helpers/verifyTokenExpired';
import useUser from '../hooks/useUser';
import { useEffect } from 'react';

const ProtectedRoutersAdmin = ({children}) => {
    const { auth } = useUser()
    const navigate = useNavigate()

    const ADMIN = import.meta.env.VITE_ROL_ADMIN
    
    useEffect(() => {
        if (!verifyTokenExpired(auth.token) || auth.rol !== ADMIN.toLowerCase()) {            
            return navigate('/login')
        }
        
    }, []);
    
  return children
}

export default ProtectedRoutersAdmin