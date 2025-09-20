import { CloseButton, Flex, HStack, Spinner, Box, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaFile, FaRegComment } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillPushpin } from "react-icons/ai"
import ChannelHeader from "../components/ChannelHeader";
import Messages from "../components/Messages";
import { SocketContext } from "../context/SocketProvider";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [channelId, setChannelId] = useState();
  const [messageId, setMessageId] = useState();
  const { channels, setChannels } = useContext(SocketContext)
  const token = localStorage.getItem("token")
  
  
  useEffect(() => {
    if (!token)
      navigate("/signin")
  }, [token])

  const channel = useMemo(
    () => {
      const channel = channels.find(channel => channel._id == channelId);
      if (!channel && channels.length > 0) {
        navigate(`/?channel=${channels[0]._id}`)
      }
      return channel;
    },
    [channels, channelId]
  );


  const [nav, setNav] = useState("message")

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setChannelId(params.get('channel'));
    setMessageId(params.get('message'));
  }, [location]);

  return (
    <HStack flexGrow={1}>
      <Flex h={"calc(100vh - 40px)"} width={"full"} >
        {channel ? (
          <VStack flexGrow={1} align="stretch">
            <ChannelHeader
              channel={channel}
            />
            <HStack paddingInline={"20px"} paddingBottom={0} justifyContent={"flex-start"} width={"360px"} justify={"space-between"} w={"full"} borderBottom='1px solid #ccc'>
              <HStack borderBottom={nav == "message" ? "2px solid #451245" : ""} w={"100px"} gap={"4px"} cursor={"pointer"} padding={"3px"} onClick={() => setNav("message")}><FaRegComment size={"18px"} /><Text>Messages</Text></HStack>
              <HStack borderBottom={nav == "file" ? "2px solid #451245" : ""} w={"100px"} gap={"4px"} cursor={"pointer"} onClick={() => setNav("file")} padding={"3px"}><FaFile size={"18px"} /><Text>Files</Text></HStack>
              <HStack borderBottom={nav == "pin" ? "2px solid #451245" : ""} w={"100px"} gap={"px"} cursor={"pointer"} onClick={() => setNav("pin")} padding={"3px"}><AiFillPushpin size={"18px"} /><Text>Pins</Text></HStack>
            </HStack>
            {
              nav == "message" && <HStack flex='1 1 0'>
                <Messages
                  flexGrow={1}
                  h='full'
                  channelId={channelId}
                  messageId={null}
                />
                {messageId && (
                  <VStack w={{ base: '50%', lg: '35%' }} h='full' align='stretch' borderLeft='1px solid #ccc'>
                    <HStack px={4} justify='space-between'>
                      <Text>
                        Thread
                      </Text>
                      <CloseButton
                        onClick={() => navigate(`/?channel=${channelId}`)}
                      />
                    </HStack>
                    <Messages
                      h='full'
                      channelId={channelId}
                      messageId={messageId}
                    />
                  </VStack>
                )}
              </HStack>}
          </VStack>
        ) : (
          <Flex flexGrow={1} h='full' direction='column' justify='center' align='center' gap={2}>
            <VStack>
              {/* <Spinner w={150} h={150} thickness="2px" borderLeft={0} borderRight={0} borderTop={"2px solid #451245"} borderBottom={"2px solid #451245"} pos={"relative"}/> */}
              <Box className="big"><Box className="circle" pos={"relative"}><Box className="cir" pos={"absolute"}></Box></Box></Box>
              <Text fontSize="50px" className="loading">
                Loading...
              </Text>
            </VStack>
          </Flex>
        )}
      </Flex>
    </HStack>
  );
};

export default HomePage;
