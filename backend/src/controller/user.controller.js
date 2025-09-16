import user from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res) {
    
    try{
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await user.find({
            $and : [
                {_id : {$ne : currentUserId}},
                {_id : {$nin : currentUser.friends}},
                {isOnboarded : true}
            ]
        });
        res.status(200).json(recommendedUsers);
    }
    catch(err){
        console.log(err);
        res.status(500);
    }
}

export async function getMyFriends(req,res) {
    try{
        const userFound = await user.findById(req.user._id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");
        
        res.status(200).json(userFound.friends);    
    }
    catch(err){
        console.log(err);
        res.status(500);
    }   
}

export async function sendFriendRequest (req,res){
   try{
    const myId = req.user.id;
    const {id : friendId} = req.params;

    if(myId == friendId) {
        res.status(400).json({message : "you cant send yourself a request"});
    }

    const friend = await user.findById(friendId);

    if(!friend) {
        res.status(400).json({message : "friend doesnt exist"});
    }

    if(friend.friends.includes(myId)){
        res.status(400).json({message : "Already a Friend"});
    }

    const existingRequest = await FriendRequest.findOne({
        $or : [
            {sender : myId ,recipient : friendId},
            {sender : friendId ,recipient : myId}]
        }
    )

    if(existingRequest){
        res.status(400).json({message : "Already Request Exists"});
    }

    const friendRequest = await FriendRequest.create({
        sender : myId,
        recipient : friendId
    })

    res.status(201).json(friendRequest);

   }
   catch(err){
    console.log(err);
    res.status(500).json({message : "Server Failed"});
   }
}

export async function acceptFriendRequest (req,res){
    try{
        const {id : requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message : "Reequest Not Found"});
        }

        if(friendRequest.recipient.toString() != req.user.id.toString()){
            return res.status(400).json({message : "You are not authorized to accept"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await user.findByIdAndUpdate(friendRequest.sender,{
            $addToSet : {friends : friendRequest.recipient}
        });
          await user.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet : {friends : friendRequest.sender}
        });

        res.status(201).json({message : "Friend request Accepted"});

    }
    catch(err){
    console.log(err);
    res.status(500).json({message : "Server Failed"});
   }
}

export async function getFriendRequests(req,res) {
    try{
        const incomingreqs = await FriendRequest.find({
            recipient : req.user.id,
            status : "pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedreqs = await FriendRequest.find({
            sender : req.user.id,
            status : "accepted",
        }).populate("recipient","fullName profilePic");
        res.status(201).json({incomingreqs,acceptedreqs});
    }
    catch(err){
    console.log(err);
    res.status(500).json({message : "Server Failed"});
   }
}

export async function getOutgoingFriendReqs(req,res){
    try{
const outgoingreqs = await FriendRequest.find({
    sender : req.user.id,
    status : "pending",
}).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

res.status(200).json(outgoingreqs);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "Server Failed"});
    }
}