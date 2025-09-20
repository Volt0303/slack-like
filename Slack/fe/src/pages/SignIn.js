import { VStack, Text, HStack, Input, Button } from "@chakra-ui/react"
import { Link,useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import toast from "../utils/toast"

const SignIn = () => {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    
    const handleSignin = async () => {
        if (!userInfo.email) toast.warning("Input your email correctly!")
        else if (!userInfo.password) toast.warning("Input your password correctly!")
        else {
            const result = await axios.post("http://localhost:8080/auth/signin", userInfo)
            if (result.data.status == "success") {
                toast.success("Sign in successed!")
                localStorage.setItem("token", result.data.token);
                navigate("/")
            }
        }
    }

    return (
        <VStack bg={'#451245'} w={"full"} h={'100vh'} align={'center'} justify={"center"}>
            <VStack boxShadow={'0 0 10px 4px gray'} border={'1px solid #451245'} w={'30%'} h={300} justifyContent={"space-around"} textColor={"#451245"} bg={"#FFF"} rounded={"10px"} gap={'16px'} padding={'20px'}>
                <VStack w={"full"} gap={"10px"}>
                    <Text fontSize={"32px"} fontWeight={"bold"} fontFamily={"cursive"}>Sign In</Text>
                    <Input type={'email'} name="email" placeholder={"Email"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                    <Input type={'password'} name="password" placeholder={"Password"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                </VStack>
                <HStack pos={"relative"} w={"full"} justify={"center"}>
                    <Button bg={'transparent'} border={'1px solid #451245'} fontFamily={"cursive"} onClick={handleSignin}>SignIn</Button>
                    <HStack pos={"absolute"} right={"0"}>
                        <Link to='/signup'>Go to signup</Link>
                    </HStack>
                </HStack>
            </VStack>
        </VStack>
    )
}

export default SignIn