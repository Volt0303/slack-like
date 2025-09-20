import { border, Box, Button, Checkbox, Flex, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import useUser from "../api/useUsers";
import { METHOD, REQUEST, STATUS } from "../constants/chat";
import { SocketContext } from "../context/SocketProvider";
import toast from "../utils/toast";

const CreateChannelModal = (props) => {
  const { users } = useUser();
  const { socket } = useContext(SocketContext);
  const [channelName, setChannelName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({});
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const onSelectUser = (id) => {
    setSelectedUsers((prev) => {
      const users = { ...prev };
      if (users[id]) {
        delete users[id];
        return users;
      } else {
        users[id] = true;
        return users;
      }
    })
  }

  const handleCreateChannel = () => {
    if (!channelName.trim()) {
      toast.error('Please input channel name');
      return;
    }
    const members = [];
    for (const selectedUser in selectedUsers) {
      members.push(selectedUser);
    }

    socket.emit(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, {
      name: channelName,
      members,
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
      <ModalContent textColor='rgb(80, 30, 80)' bg={"#FFF"} textAlign={"center"} justify={"center"} >
        <ModalHeader fontSize={24} fontWeight={"bold"}>
          Create Channel
        </ModalHeader>
        <ModalBody>
          <VStack gap={4} align='stretch'>
            <Box>
              <Input
                size='sm'
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Channel Name"
                rounded={"8px"}
                _focus={{ border: "none", outline: "none", boxShadow: "0 0 3px 2px #451245" }}
              />
            </Box>
            <VStack gap={1} align='stretch' border={"1px solid white"} padding={"8px"} rounded={"8px"}>
              {users.map(user => {
                  return <Flex
                    key={user._id}
                    p={1}
                    gap={2}
                    rounded={4}
                    cursor='pointer'
                    _hover={{ bg: '#0001' }}
                    onClick={() => onSelectUser(user._id)}
                  >
                    <Checkbox isChecked={selectedUsers[user._id]} />
                    {user.username}
                  </Flex>
              }
              )}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button size='sm' isDisabled={isCreatingChannel} bg={"transparent"} border={"1px solid #451245"} onClick={handleCreateChannel}>
            {isCreatingChannel ? <Spinner size="sm" /> : <>Create</>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateChannelModal;
