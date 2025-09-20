import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()
const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        name: "",
        email: "",
        avatar: "",
        statu: ""
    })
    let token = localStorage.getItem("token");
    useEffect(() => {
        axios({
            url: `http://localhost:8080/auth/check`,
            method: "POST",
            data: token
        }).then((result) => {
            console.log(result);
        })
    }, [])

    
    const value = { auth, setAuth, token }
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;