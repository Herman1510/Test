document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the student's name
    let studentName = document.getElementById("studentName").value;

    // Get the selected answers
    let q1Answer = document.querySelector('input[name="q1"]:checked');
    let q2Answer = document.querySelector('input[name="q2"]:checked');

    if (!q1Answer || !q2Answer) {
        alert("Please answer all questions.");
        return;
    }

    // Create an object to store the data
    let data = {
        name: studentName,
        q1: q1Answer.value,
        q2: q2Answer.value
    };

    // Store the data in localStorage (or you can use a JSON file later to store on GitHub)
    localStorage.setItem("quizResults", JSON.stringify(data));

    // Display the results
    let result = `
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Question 1:</strong> ${q1Answer.value}</p>
        <p><strong>Question 2:</strong> ${q2Answer.value}</p>
    `;
    document.getElementById("result").innerHTML = result;

    // Optionally, you can clear the form after submission
    document.getElementById("quizForm").reset();
});
