import { VStack, HStack, Text, Input, Button, Avatar } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaMailBulk, FaKey, FaLock } from "react-icons/fa"
import { useRef, useState } from "react"
import axios from "axios"
import toast from "../utils/toast"
import avatarPath from "./1.gif"

const SignUp = () => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        password: "",
        confirm: ""
    })
    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const Ava_ref = useRef();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState({
        path:avatarPath, file:null
    });
    const avatarClick = () =>{
        Ava_ref.current.click()
    }
    const avatarchange = (e) => {
        
        const file = e.target.files[0];
        
        const fileload = new FileReader();
        fileload.onload = (e) =>{
            setAvatar({path:e.target.result, file})
        }
        fileload.readAsDataURL(file)
    }   

    const handleSignup = async () => {
        if (!userInfo.username) toast.warning("Input your name")
        else if (!userInfo.email) toast.warning("Input your email")
        else if (!userInfo.password) toast.warning("Input your password")
        else if (userInfo.password !== userInfo.confirm) return toast.warning("Password confirm error!")
        else {
            const result = await axios.post("http://localhost:8080/auth/signup", userInfo)
            if (result.data.status === "success") {
                navigate('/signin')
                toast.success(result.data.mes)
            }
        }
    }

    return (
        <VStack bg={'white'} w={"full"} h={'100vh'} align={'center'} justify={"center"} >
            <VStack boxShadow={'dark-lg'} border={'1px solid white'} w={'30%'} textColor={"#451245"} rounded={"10px"} gap={'16px'} padding={'20px'}>
                <Text fontSize={"36px"} fontWeight={"bold"} fontFamily={"sans-serif"}>Sign Up</Text>
                <Avatar width={32} h={32} src={avatar.path} onClick={avatarClick} boxShadow={"0 0 8px 3px #451245"}>
                </Avatar>
                    <Input type="file"  ref={Ava_ref} onChange={(e)=>avatarchange(e)} hidden />
                <VStack w={'full'} gap={"10px"}>
                    <HStack w={"full"} gap={4}>
                        <FaUser />
                        <Input type={'text'} name="username" placeholder={"Name"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                    </HStack>
                    <HStack w={"full"} gap={4}>
                        <FaMailBulk />
                        <Input type={'email'} name="email" placeholder={"Email"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                    </HStack>
                    <HStack w={"full"} gap={4}>
                        <FaKey />
                        <Input type={'password'} name="password" placeholder={"Password"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                    </HStack>
                    <HStack w={"full"} gap={4}>
                        <FaLock />
                        <Input type={'password'} name="confirm" placeholder={"Confirm"} _focus={{ border: "none", boxShadow: "0 0 4px 2px #451245" }} onChange={(e) => handleChange(e)}></Input>
                    </HStack>
                </VStack>
                <HStack pos={"relative"} justify={"center"} w={"full"}>
                    <Button bg={'transparent'} border={'1px solid #451245'} fontWeight={"bold"} fontSize={24} onClick={handleSignup}>SignUp</Button>
                    {/* <HStack pos={'absolute'} right={0}>
                        <Link to='/signin' >Go to signin</Link>
                    </HStack> */}
                </HStack>
            </VStack>
        </VStack>
    )
}

export default SignUp