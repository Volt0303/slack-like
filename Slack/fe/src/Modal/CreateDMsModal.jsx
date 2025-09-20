import { border, Box, Button, Flex, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, VStack,Text, Avatar } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import useUser from "../api/useUsers";
import { METHOD, REQUEST, STATUS } from "../constants/chat";
import { SocketContext } from "../context/SocketProvider";
import toast from "../utils/toast";
import { FaArrowDown } from "react-icons/fa";

const CreateDMsModal = (props) => {
  const { users } = useUser();
  const { socket } = useContext(SocketContext);
  const [channelName, setChannelName] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const handleCreateChannel = () => {
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, {
      name: selectedUser.username,
      members: [selectedUser._id],
      isDm: true
    });
    setIsCreatingChannel(true);
  }

  const onCreateChannel = (status, data) => {
    if (status == STATUS.SUCCESS) {
      setIsCreatingChannel(false);
      props.onClose();
    } else if (status == STATUS.FAILED) {
      setIsCreatingChannel(false);
      toast.error(data);
    }
  }
  useEffect(() => {
    socket.on(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
    return () => {
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
    }
  }, []);

  return (
    <Modal {...props} isCentered>
      <ModalOverlay />
      <ModalContent  bg='#FFF' justify={"center"} textColor={"#451245"} textAlign={"center"}>
        <ModalHeader fontSize={24} fontWeight={"bold"}>
          Create DMs
        </ModalHeader>
        <ModalBody>
          <VStack gap={4} align='stretch'>
            <VStack gap={1} align='stretch' border={"1px solid white"} padding={"8px"} rounded={"8px"}>
              {users.map(user => (
                <Flex
                key={user._id}
                p={1}
                gap={2}
                rounded={4}
                cursor='pointer'
                _hover={{ bg: '#ddd' }}
                onClick={() => setSelectedUser(user)}
                justify={"space-between"}
                align={"center"}
                >
                <Avatar w={10} h={10} />
                  {user.username}
                  <Text>{selectedUser._id==user._id?"selected":""}</Text>
                </Flex>
              ))}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button size='sm' isDisabled={isCreatingChannel} bg={"transparent"}  border={"1px solid white"} onClick={handleCreateChannel}>
            {isCreatingChannel ? <Spinner size="sm" /> : <>Create</>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateDMsModal;
