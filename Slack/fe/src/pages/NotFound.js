import { Box, Text } from "@chakra-ui/react"

const NotFound = () => {
  return (
    <Box w={"full"} h={"100vh"} bg={"#451245"} textAlign={"center"} justifyContent={"center"} alignItems={"center"} display={"flex"}>
      <Text color={"#Fff"} fontSize={100} fontWeight={"semibold"} fontFamily={"serif"} letterSpacing={"10px"}>404:NOT FOUND</Text>
    </Box>
  )
}

export default NotFound