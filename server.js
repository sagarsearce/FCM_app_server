var admin = require("firebase-admin");
const express = require('express')
const App = express()
const Port = process.env.PORT || 3000
App.use(express.json());

// var serviceAccount = require("/Users/sagar.dhandhalya/Documents/Learning/Flutter/flutter_projects/app_sever/flutter-firebase-demo-c5029-firebase-adminsdk-o6rh9-670019004b.json");

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(
            Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64')
                .toString('ascii'))
    ),
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
                title: "Order placed successfully",
                body: `Hey ${owner.data().fullName}, your new order has been placed successfully with ${Object.values(order.data().items).length} items and ${order.data().total}$. Thank you for shopping with us..`,
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


