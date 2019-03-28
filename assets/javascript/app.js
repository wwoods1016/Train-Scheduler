$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDCjNQe2XKEPcUc6X-tkUk-yQx7rfFYKJw",
        authDomain: "train-scheduler-62401.firebaseapp.com",
        databaseURL: "https://train-scheduler-62401.firebaseio.com",
        projectId: "train-scheduler-62401",
        storageBucket: "train-scheduler-62401.appspot.com",
        messagingSenderId: "86455402305"
    };
    firebase.initializeApp(config);



    let database = firebase.database();

    // Add train button
    $("#submit").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();
        // console.log(trainName);

        // Clears form after submitting
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
        // Pushing to databse
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });   
        
        return false;     


    });


    database.ref().on("child_added", function (childSnapshot) {

        // Formatting
        let firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference in minutes
        let diffTime = moment().diff(moment(firstTrainNew), "minutes");
        let remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until the next train
        let minsAway = childSnapshot.val().frequency - remainder;
        // When next train arrives
        let nextTrain = moment().add(minsAway, "minutes");
        // Formatting
        nextTrain = moment(nextTrain).format("hh:mm");

        // Appends table data to HTML
        $("#addTableData").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextTrain + "</td><td>" + minsAway + "</td></tr>");

        // Error handling
    },  function (errorObject) {
            console.log("Error: " + errorObject.code);
    });

});