import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { HStack, VStack } from "@chakra-ui/react"
import Menubar from "./Menubar"

const Layout = () => {
    return (
        <VStack w={"full"} h={"100vh"}>
            <Header />
            <HStack w={"full"} h={"calc(100vh - 40px)"} >
                <Sidebar />
                <Menubar />
                <Outlet />
            </HStack>
        </VStack>
    )
}

export default Layout