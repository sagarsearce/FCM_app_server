var admin = require("firebase-admin");
const express = require('express')
const App = express()
const Port = process.env.PORT || 3000
App.use(express.json());

var serviceAccount = require("/Users/sagar.dhandhalya/Documents/Learning/Flutter/flutter_projects/app_sever/flutter-firebase-demo-c5029-firebase-adminsdk-o6rh9-670019004b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

App.post('/notify', async (req, res) => {
    console.log('/notify hit !!!');
    const { userId, orderId } = req.body;
    try {
        const owner = await admin.firestore().collection("users").doc(userId).get();
        const order = await admin.firestore().collection("orders").doc(orderId).get();
        console.log(owner.data().tokens[0]);
        console.log(order.data().status);
        await admin.messaging().sendMulticast({
            tokens: owner.data().tokens,
            notification: {
                title: "order placed.",
                body: `Hey, thank you ${owner.data().fullName} for choosing us,your new order is placed of ${order.data().total}$ we will notify you after sheeping.`,
            },
        });
        res.status(200).json(JSON.stringify({ message: 'notification sent successfully' }));
        return;
    } catch (e) {
        res.status(300).json(JSON.stringify({ message: 'Some error !!' }));
        return;
    }

})

App.listen(Port, () => {
    console.log(`Express app listening at ${Port}`)
})


