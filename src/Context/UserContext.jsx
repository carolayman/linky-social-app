import { createContext, useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode"

export let UserContext = createContext()

export default function UserContextProvider({children}){
    
    const [userLogin, setUserLogin]  = useState(localStorage.getItem('userToken'))  
    const [LoggedUserId, setLoggedUserId]  = useState(null)  

    // useEffect(() => {
    //     if(localStorage.getItem('userToken')){
    //         setUserLogin(localStorage.getItem('userToken'))
    //     }
    // },[])

    useEffect(() => {
        if(localStorage.getItem('userToken')){
            const {user} = jwtDecode(localStorage.getItem('userToken'))
            setLoggedUserId(user)
        }
    },[userLogin])

    return <UserContext.Provider value={{userLogin,setUserLogin,LoggedUserId}}>
        {children}
    </UserContext.Provider>
}