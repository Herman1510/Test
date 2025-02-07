// Initialize Firebase with your project credentials
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle form submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get student name
    let studentName = document.getElementById("studentName").value;

    // Get selected answers
    let q1Answer = document.querySelector('input[name="q1"]:checked');
    let q2Answer = document.querySelector('input[name="q2"]:checked');
    let q3Answer = document.querySelector('input[name="q3"]:checked');
    let q4Answer = document.querySelector('input[name="q4"]:checked');
    let q5Answer = document.querySelector('input[name="q5"]:checked');

    // Validate that all questions are answered
    if (!q1Answer || !q2Answer || !q3Answer || !q4Answer || !q5Answer) {
        alert("Please answer all questions before submitting.");
        return;
    }

    // Create an object with student responses
    let quizData = {
        name: studentName,
        q1: q1Answer.value,
        q2: q2Answer.value,
        q3: q3Answer.value,
        q4: q4Answer.value,
        q5: q5Answer.value,
        timestamp: new Date().toISOString() // Store submission time
    };

    // Save to Firebase
    database.ref("quizResults").push(quizData).then(() => {
        alert("Quiz submitted successfully!");
    }).catch(error => {
        console.error("Error saving to database:", error);
    });

    // Display the results on the page
    let resultHTML = `
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Question 1:</strong> ${q1Answer.value}</p>
        <p><strong>Question 2:</strong> ${q2Answer.value}</p>
        <p><strong>Question 3:</strong> ${q3Answer.value}</p>
        <p><strong>Question 4:</strong> ${q4Answer.value}</p>
        <p><strong>Question 5:</strong> ${q5Answer.value}</p>
    `;
    document.getElementById("result").innerHTML = resultHTML;

    // Clear the form after submission
    document.getElementById("quizForm").reset();
});

// Display stored results for teachers
const resultsRef = database.ref("quizResults");
resultsRef.on("value", function(snapshot) {
    let data = snapshot.val();
    let resultsHTML = "<h3>Quiz Submissions</h3><table border='1'><tr><th>Name</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Q5</th><th>Time</th></tr>";

    for (let key in data) {
        resultsHTML += `<tr>
            <td>${data[key].name}</td>
            <td>${data[key].q1}</td>
            <td>${data[key].q2}</td>
            <td>${data[key].q3}</td>
            <td>${data[key].q4}</td>
            <td>${data[key].q5}</td>
            <td>${new Date(data[key].timestamp).toLocaleString()}</td>
        </tr>`;
    }

    resultsHTML += "</table>";
    document.getElementById("teacherResults").innerHTML = resultsHTML;
});
