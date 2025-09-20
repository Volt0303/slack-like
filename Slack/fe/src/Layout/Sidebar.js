import { VStack, HStack, Text, Box, Avatar } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaHome, FaUserSlash, FaUserCheck, FaHotjar, FaSignOutAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { SocketContext } from "../context/SocketProvider"
import { REQUEST, STATU } from "../constants/chat"

const Sidebar = () => {
  const { auth, socket } = useContext(SocketContext)
  const navigate = useNavigate()
  const logout = () => {
    socket.emit(REQUEST.STATU, { id: auth._id, statu: "logout" })
    localStorage.removeItem("token")
    navigate('/signin')
  }
  const [showbox, setShowbox] = useState(false)
  const [color, setColor] = useState("green")
  const handlebox = () => {
    setShowbox(!showbox)
  }


  const token = localStorage.getItem("token")

  const online = () => {
    socket.emit(REQUEST.STATU, { id: auth._id, statu: "online" })
  }
  const offline = () => {
    socket.emit(REQUEST.STATU, { id: auth._id, statu: "offline" })
  }
  const busy = () => {
    socket.emit(REQUEST.STATU, { id: auth._id, statu: "busy" })
  }

  const request =(data)=>{
    console.log(data);
  }

  useEffect(() => {
    socket.on(REQUEST.STATU, request)
    socket.on(REQUEST.STATU, offline)
    socket.on(REQUEST.STATU, busy)
    socket.on(REQUEST.STATU, logout)
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    
  },[socket])


  return (
    <VStack width={"60px"} h={"calc(100vh - 40px)"} bg={"#451245"} py={'26px'} justify={"space-between"}>
      <VStack gap={"20px"} >
        <VStack>
          <VStack color="white" w="36px" h="36px" bgColor={"#703770"} rounded={"6px"} justify={"center"} alignItems={"center"} _hover={{ bg: "#111" }} cursor={"pointer"}>
            <FaHome />
          </VStack>
          <Text color={"white"} fontSize={"12px"}>Home</Text>
        </VStack>
      </VStack>
      <VStack pos={"relative"} className="user" onClick={handlebox}>
        <Avatar w="40px" h={"40px"} rounded={4} />
        <Box className="bottom" border={"2px solid #fff"} w={4} h={4} rounded={"50%"} zIndex={20} bg={color} pos={"absolute"} bottom={"-2px"} right={"-2px"}></Box>
        <Box pos={"absolute"} className="status" display={showbox ? "block" : "none"} left={"100%"} bottom={"0%"} padding={"4px"} w={"100px"} border={"2px solid #FFF"} zIndex={5} rounded={4} bg={"#d6add6ff"} color={"white"}>
          <HStack cursor={"pointer"} gap={2} color={"yellow"} onClick={offline} fontWeight={500}>
            <FaUserSlash />
            <Text>Offline</Text>
          </HStack>
          <HStack cursor={"pointer"} gap={2} color={"green"} onClick={online} fontWeight={500}>
            <FaUserCheck />
            <Text>Online</Text>
          </HStack>
          <HStack cursor={"pointer"} gap={2} color={"red"} onClick={busy} fontWeight={500}>
            <FaHotjar />
            <Text>Busy</Text>
          </HStack>
          <HStack cursor={"pointer"} gap={2} onClick={logout} fontWeight={500} color={"blue"}>
            <FaSignOutAlt />
            <Text>Log Out</Text>
          </HStack>
        </Box>
      </VStack>
    </VStack>
  )
}

export default Sidebar