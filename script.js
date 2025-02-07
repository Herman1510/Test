// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Correct answers
const correctAnswers = {
    q1: "d",
    q2: "c",
    q3: "a",
    q4: "e",
    q5: "c"
};

// Handle quiz submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get student name
    let studentName = document.getElementById("studentName").value;

    // Get selected answers
    let q1 = document.querySelector('input[name="q1"]:checked');
    let q2 = document.querySelector('input[name="q2"]:checked');
    let q3 = document.querySelector('input[name="q3"]:checked');
    let q4 = document.querySelector('input[name="q4"]:checked');
    let q5 = document.querySelector('input[name="q5"]:checked');

    // Validate that all questions are answered
    if (!q1 || !q2 || !q3 || !q4 || !q5) {
        alert("Please answer all questions before submitting.");
        return;
    }

    // Store answers
    let studentAnswers = {
        name: studentName,
        q1: q1.value,
        q2: q2.value,
        q3: q3.value,
        q4: q4.value,
        q5: q5.value,
        timestamp: new Date().toISOString()
    };

    // Calculate score
    let score = 0;
    if (q1.value === correctAnswers.q1) score++;
    if (q2.value === correctAnswers.q2) score++;
    if (q3.value === correctAnswers.q3) score++;
    if (q4.value === correctAnswers.q4) score++;
    if (q5.value === correctAnswers.q5) score++;

    let totalQuestions = 5;
    let percentage = (score / totalQuestions) * 100;
    let grade = "";

    // Assign grade
    if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else {
        grade = "F";
    }

    // Save to Firebase
    studentAnswers.score = score;
    studentAnswers.percentage = percentage;
    studentAnswers.grade = grade;

    database.ref("quizResults").push(studentAnswers)
        .then(() => {
            alert("Quiz submitted successfully!");
        })
        .catch(error => {
            console.error("Error saving to database:", error);
        });

    // Display results to the student
    document.getElementById("result").innerHTML = `
        <h3>Submission Summary</h3>
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Score:</strong> ${score}/${totalQuestions} (${percentage.toFixed(2)}%)</p>
        <p><strong>Grade:</strong> ${grade}</p>
    `;

    // Clear form after submission
    document.getElementById("quizForm").reset();
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
