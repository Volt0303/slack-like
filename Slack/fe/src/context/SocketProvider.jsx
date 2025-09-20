import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { REQUEST, METHOD, STATUS } from "../constants/chat";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthProvider";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  let token = localStorage.getItem("token");
  const socket = useMemo(() => io(`${process.env.REACT_APP_BASE_URL}`, { extraHeaders: { token } }), [token]);
  const [channels, setChannels] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const {auth, setAuth} = useContext(AuthContext)
    useEffect(() => {
    socket.on("auth", (data) => {
      setAuth(data.user);
    });
    return () => {
      socket.removeListener("auth", (data) => {
        setAuth(data.user);
      })
    }
  }, []);
  
  useEffect(() => {
    socket.emit("auth", {
      data: token
    })
  }, []);
  
  socket.on('connect', () => {
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  useEffect(() => {
    socket.emit(REQUEST.AUTH, token);
  }, [socket]);
  
  useEffect(() => {
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.READ}`);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.READ}`, onReadChannels);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, onUpdateChannel);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, onDeleteChannel);
    return () => {
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.READ}`, onReadChannels);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, onUpdateChannel);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, onDeleteChannel);
    }
  }, []);

  const onCreateChannel = (status, data) => {
    if (status == STATUS.ON) {
      setChannels(prev => [...prev, data]);
    }
  }

  const onReadChannels = (status, data) => {
    
    if (status == STATUS.ON) {
      setChannels(data);
    }
  }
  

  const onUpdateChannel = (status, data) => {
    if (status == STATUS.ON) {
      setChannels((prev) => prev.map(channel => channel._id == data._id ? data : channel));
    }
  }

  const onDeleteChannel = (status, data) => {

    if (status == STATUS.ON) {
      setChannels((prev) => prev.filter(channel => channel._id != data.id));
    } else if(status == STATUS.FAILED){
      toast.error(data.message)
    }
  }

  return (
    <SocketContext.Provider
      value={{
        channels,
        setChannels,
        isConnected,
        socket,auth
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
