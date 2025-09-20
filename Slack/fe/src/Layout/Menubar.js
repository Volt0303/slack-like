import { VStack, HStack, Text, Flex, Avatar } from "@chakra-ui/react"
import { useContext, useEffect, useState, useMemo } from "react"
import { FaCaretDown, FaCaretRight, FaBell, FaEdit, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import { SocketContext } from "../context/SocketProvider";
import { useNavigate, useLocation } from "react-router-dom";
import CreateChannelModal from "../Modal/CreateChannelModal";
import ChannelEditModal from "../Modal/ChannelEditModal";
import ChannelDMsModal from "../Modal/CreateDMsModal"
import { METHOD, REQUEST } from "../constants/chat";
import useUser from "../api/useUsers"
import user from "../api/useUsers";

const Menubar = () => {
  const [showChannels, setShowChannels] = useState(1)
  const [showDMs, setShowDMs] = useState(1)
  const [showCreateChannelModal, setShowCreateChannelModal] = useState()
  const [showEditChannelModal, setShowEditChannelModal] = useState(false)
  const [showCreateDMsModal, setShowCreateDMsModal] = useState(false)
  const [channelInfo, setChannelInfo] = useState({})
  const { channels, setChannels, socket } = useContext(SocketContext)
  const [channelId, setChannelId] = useState()
  const navigate = useNavigate()
  const location = useLocation()

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
  const chList = channels.filter(v => v.isDm == false)
  // console.log(chList);
  
  const dmList = channels.filter(v => v.isDm == true)
// console.log(dmList);


  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setChannelId(params.get('channel'))
  })
  const handleEditChannel = (channel) => {
    setShowEditChannelModal(true)
    setChannelInfo(channel)
    // console.log(channel);
  }
  const handleDeleteChannel = (id) => {
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, { id: id });
    // console.log(id, "sent=====================");
  }
  const handleDeleteDM = (id) => {
    // console.log("---------------", id); 
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, { id: id })
  }

  const { users } = useUser()
  return (
    <VStack w={"280px"} bg='rgb(80, 30, 80)' h={"calc(100vh - 40px)"} align={"stretch"} p={4} gap={1}>
      <HStack color={"white"} align={"center"}>
        <Text fontSize={"18px"}>Rich experience</Text>
        <FaCaretDown />
      </HStack>
      <HStack color={"white"} align={"center"} onClick={() => setShowChannels(!showChannels)} cursor={"pointer"}>
        {showChannels ? <FaCaretDown /> : <FaCaretRight />}
        <Text>Channels</Text>
      </HStack>
      {
        chList.map(channel => (
          <Flex
            display={showChannels ? "flex" : "none"}
            key={channel._id}
            justify='space-between'
            align='center'
            rounded={4}
            cursor='pointer'
            _hover={{ bg: '#fff2' }}
            {...(channelId == channel._id && { bg: '#0002' })}
            paddingLeft={'16px'}
            onClick={() => navigate(`/?channel=${channel._id}`)}
          >
            <Text color="white">
              # {channel.name}
            </Text>
            <HStack color="white" gap={"6px"}>
              <HStack cursor='pointer' onClick={() => handleEditChannel(channel)}>
                <FaEdit />
              </HStack>
              <HStack cursor={"pointer"} onClick={() => handleDeleteChannel(channel._id)}>
                <FaTrash />
              </HStack>
            </HStack>
          </Flex>
        ))
      }
      <HStack color={"white"} gap={"6px"} cursor={"pointer"} _hover={{ bg: '#fff2' }} padding={"6px"} rounded={4} onClick={() => setShowCreateChannelModal(true)}>
        <FaPlus />
        <Text>
          Create channel
        </Text>
      </HStack>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        setChannels={setChannels}
      />
      <ChannelEditModal
        key={channelInfo._id}
        channel={channelInfo}
        isOpen={showEditChannelModal}
        onClose={() => setShowEditChannelModal(false)}
      />

      <ChannelDMsModal
        isOpen={showCreateDMsModal}
        onClose={() => setShowCreateDMsModal(false)}
      />



      <HStack color={"white"} align={"center"} onClick={() => setShowDMs(!showDMs)} cursor={"pointer"}>
        {showDMs ? <FaCaretDown /> : <FaCaretRight />}
        <Text>Direct messages </Text>
      </HStack>
      {dmList.map((p, i) => {
        return <HStack key={i}
          display={showDMs ? "flex" : "none"}
          justify='space-between'
          align='center'
          rounded={4}
          cursor='pointer'
          _hover={{ bg: '#fff2' }}
          paddingLeft={'16px'}
          color={"white"}
        >
          <HStack gap={2}>
            <Avatar w={"32px"} h={"32px"}/>
            <Text>{p.name}</Text>
          </HStack>
          <FaTrash onClick={() => handleDeleteDM(p._id)} />
        </HStack>
      })}
      <HStack color={"white"} gap={"6px"} cursor={"pointer"} _hover={{ bg: '#fff2' }} padding={"6px"} rounded={4} onClick={() => setShowCreateDMsModal(true)}>
        <FaPlus />
        <Text>
          Create DMs
        </Text>
      </HStack>
    </VStack>
  )
}

export default Menubar