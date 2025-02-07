// Set the time for the countdown (2 hours in milliseconds)
const countDownTime = 2 * 60 * 60 * 1000;
const countDownDate = new Date().getTime() + countDownTime;

const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `Time Left: ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "Time is up!";
        submitQuiz();
    }
}, 1000);

// Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function: Submit Quiz
function submitQuiz() {
    let studentName = document.getElementById("studentName").value || "Anonymous";

    let q1 = document.querySelector('input[name="q1"]:checked');
    let q2 = document.querySelector('input[name="q2"]:checked');
    let q3 = document.querySelector('input[name="q3"]:checked');
    let q4 = document.querySelector('input[name="q4"]:checked');
    let q5 = document.querySelector('input[name="q5"]:checked');

    let studentAnswers = {
        name: studentName,
        q1: q1 ? q1.value : "No Answer",
        q2: q2 ? q2.value : "No Answer",
        q3: q3 ? q3.value : "No Answer",
        q4: q4 ? q4.value : "No Answer",
        q5: q5 ? q5.value : "No Answer",
        timestamp: new Date().toISOString()
    };

    database.ref("quizResults").push(studentAnswers)
        .then(() => {
            alert("Quiz submitted successfully!");
        })
        .catch(error => {
            console.error("Error saving to database:", error);
        });

    document.getElementById("quizForm").style.display = "none";
}

// Manual Form Submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});
