import { Button, Flex, HStack, Textarea, Box, VStack } from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { FaPaperPlane, FaHeadphonesAlt, FaMicrophoneAlt, FaBold, FaItalic, FaLink, FaList, FaRegSmile, FaFolder, FaAt } from "react-icons/fa"
import { METHOD, REQUEST } from "../constants/chat";
import { SocketContext } from "../context/SocketProvider";

const SendMessage = ({ isEditing, channelId, messageId, value, onClose }) => {
    const { socket } = useContext(SocketContext);
    const [message, setMessage] = useState(value);
    const isTyping = useRef(false);

    const handleSend = () => {
        if (isEditing) {
            socket.emit(
                `${REQUEST.MESSAGE}_${METHOD.UPDATE}`,
                {
                    id: messageId,
                    message: { message },
                }
            );
        } else {
            socket.emit(
                `${REQUEST.MESSAGE}_${METHOD.CREATE}`,
                {
                    channel: channelId,
                    parent: messageId,
                    message,
                }
            );
            setMessage('');
        }
        onClose?.();
    }

    // const emoticons = useMemo(() => {
    //     return message.emoticons.reduce((prev, emoticon) => {
    //       const group = prev.some(prev => prev.code == emoticon.code);
    //       if (!group) {
    //         return [...prev, { code: emoticon.code, users: [emoticon.creator] }];
    //       }
    //       return prev.map(group => {
    //         if (group.code == emoticon.code) {
    //           return {
    //             code: emoticon.code,
    //             users: [...group.users, emoticon.creator],
    //           }
    //         }
    //         return group;
    //       });
    //     }, []);
    //   }, [message]);


    const handleTyping = () => {
        if (isTyping.current)
            return;

        isTyping.current = true;

        socket.emit(REQUEST.TYPING, {
            channelId,
            messageId,
        });

        setTimeout(() => {
            isTyping.current = false;
        }, 2500);
    }



    return (
        <Flex p={4} gap={4}>
            <HStack w={"full"} align={"flex-start"} flexDirection={"column"} h={"130px"} border={"2px solid #ddd"} rounded={4}>
                <HStack gap={4} paddingInline={8} paddingBlock={2} w={"full"} bg={"#ddd"}><FaHeadphonesAlt cursor={"pointer"} /><FaMicrophoneAlt cursor={"pointer"} /><FaBold cursor={"pointer"} /><FaItalic cursor={"pointer"} /><FaLink cursor={"pointer"} /><FaList cursor={"pointer"} /></HStack>
                <Textarea
                    value={message}
                    minH={16}
                    focusBorderColor="none"
                    onChange={(e) => setMessage(e.target.value)}
                    border={"none"}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter' && !(e.shiftKey || e.ctrlKey)) {
                            handleSend();
                            e.preventDefault();
                        }
                        if (e.key == 'Escape') {
                            onClose?.();
                        }
                        handleTyping();
                    }}
                />
                <HStack paddingInline={8} bg={"#ddd"} paddingBlock={2} w={"full"} gap={4} justify={"space-between"}>
                    <HStack gap={2}>
                        <FaRegSmile cursor={"pointer"} pos={"relative"} />
                        <Box pos={"absolute"} bottom={"100%"} left={"10%"} w={50} h={40} border={"2px solid #451245"} rounded={8}>

                        </Box>
                        <FaFolder cursor={"pointer"}/>
                        <FaAt cursor={"pointer"}/>
                    </HStack>
                    <FaPaperPlane onClick={handleSend} cursor={"pointer"} />
                </HStack>
            </HStack>
        </Flex>
    )
}

export default SendMessage;
