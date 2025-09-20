import { VStack, Input, HStack } from "@chakra-ui/react"
import { FaSearch } from "react-icons/fa"

const Header = () => {
    return (
        <VStack w={"full"} height={"40px"} bg={"#451245"} align={"center"} justify={"center"}>
            <HStack width={"460px"} pos={"relative"}>
                <HStack pos={"absolute"} left={"10px"}><FaSearch color="white" /></HStack>
                <Input placeholder="search anything u want..." _placeholder={{color:"#DDD"}} type="text" height={'95%'} _focus={{border:"none",outline:"none",boxShadow:"0 0 3px 2px #FFF"}} textColor={"white"} padding={"4px"} paddingInline={"32px"} />
            </HStack>
        </VStack>
    )
}

export default Header;