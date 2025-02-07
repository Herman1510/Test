// Countdown timer set to 1 minute (60,000 milliseconds)
const countDownTime = 1 * 60 * 1000;
const countDownDate = new Date().getTime() + countDownTime;

const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `Time Left: ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "Time is up!";
        submitQuiz();
    }
}, 1000);

// Firebase Configuration
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

// Correct Answers
const correctAnswers = {
    q1: "d",
    q2: "c"
};

// Submit Quiz Function
function submitQuiz() {
    let studentName = document.getElementById("studentName").value || "Anonymous";

    let q1 = document.querySelector('input[name="q1"]:checked');
    let q2 = document.querySelector('input[name="q2"]:checked');

    let answers = {
        name: studentName,
        q1: q1 ? q1.value : "No Answer",
        q2: q2 ? q2.value : "No Answer",
        timestamp: new Date().toISOString()
    };

    let score = 0;
    if (answers.q1 === correctAnswers.q1) score++;
    if (answers.q2 === correctAnswers.q2) score++;

    let grade;
    if (score === 2) grade = "A";
    else if (score === 1) grade = "B";
    else grade = "F";

    answers.score = score;
    answers.grade = grade;

    database.ref("quizResults").push(answers)
        .then(() => {
            document.getElementById("quizForm").style.display = "none";
            document.getElementById("result").innerHTML = `
                <h3>Quiz Submitted!</h3>
                <p>Name: ${studentName}</p>
                <p>Score: ${score}/2</p>
                <p>Grade: ${grade}</p>
            `;
        })
        .catch(error => console.error("Error saving to database:", error));
}

// Manual Form Submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});
