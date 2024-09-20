
import { useNavigate } from 'react-router-dom'
import verifyTokenExpired from '../helpers/verifyTokenExpired';
import useUser from '../hooks/useUser';
import { useEffect } from 'react';

const ProtectedRouters = ({children}) => {
    const { auth } = useUser()
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!verifyTokenExpired(auth.token)) {            
            return navigate('/login')
        }
        
    }, []);
    
  return children
}

export default ProtectedRouters