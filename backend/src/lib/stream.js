import {StreamChat} from "stream-chat";
import "dotenv/config";
import user from "../models/User.js";

const apikey = process.env.API_KEY;
const secretkey = process.env.SECRET_KEY;

if(!apikey || !secretkey){
    console.error("Secrets are missing");
}

const streamClient = StreamChat.getInstance(apikey,secretkey);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }
    catch(err) {
        console.log(err);
    }
}

export const generateStreamToken = (userId) => {
    try{
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }
    catch(err) {
        console.log(err);
    }
}
