// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQdOfuc1CLceg7TX4M",
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
    q2: "c",
    q3: "a",
    q4: "e",
    q5: "c"
};

// Timer Variables
let totalTime = 2 * 60 * 60; // 2 hours in seconds
let timerInterval;

// Function to start countdown timer
function startTimer() {
    const timerDisplay = document.getElementById("timer");
    
    timerInterval = setInterval(() => {
        let hours = Math.floor(totalTime / 3600);
        let minutes = Math.floor((totalTime % 3600) / 60);
        let seconds = totalTime % 60;

        // Format time display
        timerDisplay.innerHTML = `Time Left: ${hours}h ${minutes}m ${seconds}s`;

        // If time runs out, auto-submit the quiz
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Auto-submitting your quiz.");
            submitQuiz();
        }

        totalTime--; // Reduce time
    }, 1000);
}

// Start timer when page loads
window.addEventListener("load", startTimer);

// Function to submit quiz
function submitQuiz() {
    let studentName = document.getElementById("studentName").value || "Anonymous";

    // Get selected answers
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

    // Calculate score
    let score = 0;
    if (studentAnswers.q1 === correctAnswers.q1) score++;
    if (studentAnswers.q2 === correctAnswers.q2) score++;
    if (studentAnswers.q3 === correctAnswers.q3) score++;
    if (studentAnswers.q4 === correctAnswers.q4) score++;
    if (studentAnswers.q5 === correctAnswers.q5) score++;

    let totalQuestions = 5;
    let percentage = (score / totalQuestions) * 100;
    let grade = percentage >= 80 ? "A" :
                percentage >= 70 ? "B" :
                percentage >= 60 ? "C" :
                percentage >= 50 ? "D" : "F";

    // Save to Firebase
    studentAnswers.score = score;
    studentAnswers.percentage = percentage;
    studentAnswers.grade = grade;

    database.ref("quizResults").push(studentAnswers)
        .then(() => {
            alert("Quiz submitted successfully!");
            clearInterval(timerInterval); // Stop timer
        })
        .catch(error => {
            console.error("Error saving to database:", error);
        });

    // Display results to student
    document.getElementById("result").innerHTML = `
        <h3>Submission Summary</h3>
        <p><strong>Name:</strong> ${studentAnswers.name}</p>
        <p><strong>Score:</strong> ${score}/${totalQuestions} (${percentage.toFixed(2)}%)</p>
        <p><strong>Grade:</strong> ${grade}</p>
    `;

    // Hide the quiz form after submission
    document.getElementById("quizForm").style.display = "none";
}

// Manual submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Display stored results for teachers
const resultsRef = database.ref("quizResults");
resultsRef.on("value", function(snapshot) {
    let data = snapshot.val();
    let resultsHTML = "<h3>Quiz Submissions</h3><table border='1'><tr><th>Name</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Time</th></tr>";

    for (let key in data) {
        resultsHTML += `<tr>
            <td>${data[key].name}</td>
            <td>${data[key].score}</td>
            <td>${data[key].percentage.toFixed(2)}%</td>
            <td>${data[key].grade}</td>
            <td>${new Date(data[key].timestamp).toLocaleString()}</td>
        </tr>`;
    }

    resultsHTML += "</table>";
    document.getElementById("teacherResults").innerHTML = resultsHTML;
});
