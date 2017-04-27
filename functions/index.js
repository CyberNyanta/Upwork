const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/*exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
        .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
console.log('Uppercasing', event.params.pushId, original);
const uppercase = original.toUpperCase();
// You must return a Promise when performing asynchronous tasks inside a Functions such as
// writing to the Firebase Realtime Database.
// Setting an "uppercase" sibling in the Realtime Database returns a Promise.
return event.data.ref.parent.child('uppercase').set(uppercase);
});*/
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.LikeArticle = functions.https.onRequest((req, res) => {
        // Grab the text parameter.
        const hashNumber = req.query.hashNumber;
        const user = req.query.user;
// Push it into the Realtime Database then send a response
    userRef = admin.database().ref('users/' + user);
    userRef.once("value").then( function(snap) {
        userNode = snap.val();
    })
    admin.database().ref('/newzme/news_data/' + hashNumber).once("value").then( function(snap) {

        article = snap.val();
        var likes = snap.child("likes");

        var likescount = likes.val();;
        likes.ref.set(likescount+1);

        }).then(function (){

        var keywords = article.keywords;
        var topics = article.keywords;
        var feedName = article.feed.name;
        var hash = article.hash;

        if(userNode == null) userNode =  {};
        if(userNode['keywords'] == null) userNode['keywords'] =  {};
        if(userNode['topics'] == null) userNode['topics'] =  {};
        if(userNode['feeds'] == null) userNode['feeds'] =  {};
        if(userNode.readarray == null) userNode.readarray = new Array();

        for (var i = 0; i <  keywords.length; i++){
            var key = keywords[i];
            var existingKey = userNode['keywords'][key]
            if (existingKey !=  null){
                userNode['keywords'][key] =  existingKey + 1;
            }
            else {
                userNode['keywords'][key] = 0;
            }
        }

        for (var i = 0; i <  topics.length; i++){
            var topic = topics[i];
            var existingTopic = userNode['topics'][topic]
            if (existingTopic !=  null){
                userNode['topics'][topic] =  existingTopic + 1;
            }
            else {
                userNode['topics'][topic] = 0;
            }
        }

        var existingFeedName = userNode['feeds'][feedName]
        if (existingFeedName !=  null){
            userNode['feeds'][feedName] =  existingFeedName + 1;
        }
        else {
            userNode['feeds'][feedName] = 0;
        }

        userNode.readarray.indexOf("");
        userNode.readarray.push(hash);

        console.log(userNode);
        console.log(article);

        userRef.set(userNode);
        res.status(200).json(userNode);
        });

});

