const verifyTokenExpired = (token) => {

  
    if (token == "" || token === undefined) {
        return false;
    }
    
    const arrayToken = token.split('.')
    const tokenPayload = JSON.parse(atob(arrayToken[1]))
    
    if (Math.floor(new Date().getTime() /1000) >= tokenPayload?.exp || token == "") {
      localStorage.removeItem('authentication')
      return false;
    }
    
    return true;
  }
  
  export default verifyTokenExpired