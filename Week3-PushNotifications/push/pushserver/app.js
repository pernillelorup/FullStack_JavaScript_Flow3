const { Expo } = require("expo-server-sdk");
const express = require("express");
const app = express();
const PORT = 5555;

app.use(express.json());

//push tokens bliver lagt ind i users
let users = [];

app.get("/", (req, res) => res.send("Push Demo Server"));

app.post("/register", (req, res) => {
    const newUser = req.body;
    //newUser.id = newUser.id+(Math.floor(Math.random()*100)) //For "alene test"
    console.log(newUser)
    const index = users.findIndex(u => u.id === newUser.id);
    if (index >= 0) {  //Remove user if he already exists
        users.splice(index, 1);
    }
    if (users.length > 0) {
        notifyUsers(users, newUser, "new-user");
    }
    users.push(newUser);
    res.json(newUser);

})

app.post("/send", (req, res) => {
    const msg = req.body;
    if (users.length > 0) {
        notifyUsers(users, msg, "text");
    }
    res.json({ info: `This message was sent`, msg })
})

async function notifyUsers(users, msg, type) {
    let expo = new Expo();
    let messages = [];
    for (let user of users) {
        if (!Expo.isExpoPushToken(user.pushToken)) {
            console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
            continue;
        }
        msg.msgType = type;
        messages.push({
            to: user.pushToken,
            sound: 'default',
            body: 'new User logged in',
            data: msg,
        })
    }
    console.log("messages", messages)
    let chunks = expo.chunkPushNotifications(messages);
    console.log("Chunks", chunks.length)
    let tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk); //Not used in this example
        } catch (error) {
            console.error(error);
        }
    };
}



app.listen(PORT, () => "Server started, listeniing on port: " + PORT);
