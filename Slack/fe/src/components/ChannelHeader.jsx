import { Avatar, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
// import { METHOD, REQUEST } from "../constants/chat";
import { SocketContext } from "../context/SocketProvider";

const ChannelHeader = ({ channel, ...props }) => {
  const { socket } = useContext(SocketContext);

  // const handleDeleteChannel = () => {
  //   socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, { id: channel._id });
  // }

  return (
    <>
      <Flex p={4} justify='space-between' {...props}>
        <HStack>
          <Text     fontSize= {"24px"}fontWeight={800}>
            # {channel.name}
          </Text>
        </HStack>
        <Flex gap={2}>
          <Flex>
            {channel.members.filter((_, index) => index < 4).map(member => (
              <Box ml={-2} key={member._id}>
                <Avatar size="xs" />
              </Box>
            ))}
          </Flex>
          {channel.members.length > 4 && (
            <Text>
              +{channel.members.length - 4}
            </Text>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default ChannelHeader;
