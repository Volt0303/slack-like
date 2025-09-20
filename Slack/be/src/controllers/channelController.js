const channelService = require('../services/channelService');
const { sendToUsers } = require('../utils/chat');
const { STATUS, REQUEST, METHOD } = require('../constants/chat');
const user = require('../models/user');


exports.statu = async (socket, data) => {
    try {
        const statu = data.statu
        // const updateUser = await user.updateOne({_id:socket.user.id},{statu:statu})
        if(statu=="online")
        socket.emit(REQUEST.STATU, statu)
    } catch (error) {
    }
}

exports.create = async (socket, data) => {
    try {
        const channel = await channelService.create({
            creator: socket.user.id,
            ...data,
        });
        sendToUsers(socket.socketList, channel.members, `${REQUEST.CHANNEL}_${METHOD.CREATE}`, STATUS.ON, channel);
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, STATUS.SUCCESS);
    } catch (err) {
        console.error(err);
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.read = async (socket, data) => {
    try {
        // console.log(socket.user);
        
        const channels = await channelService.read(socket.user.id);
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.READ}`, STATUS.ON, channels);
    } catch (err) {
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.READ}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.update = async (socket, data) => {
    try {
        console.log("here");
        
        const channel = await channelService.update(socket.user.id, data.id, data.channel);
        sendToUsers(socket.socketList, channel.members, `${REQUEST.CHANNEL}_${METHOD.UPDATE}`, STATUS.ON, channel);
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.delete = async (socket, data) => {
    try {
        const channel = await channelService.delete(socket.user.id, data.id);
        sendToUsers(socket.socketList, channel.members, `${REQUEST.CHANNEL}_${METHOD.DELETE}`, STATUS.ON, data);
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}
