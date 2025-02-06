document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let studentName = document.getElementById("studentName").value;
    let q1Answer = document.querySelector('input[name="q1"]:checked');

    if (!q1Answer) {
        alert("Please answer all questions.");
        return;
    }

    let data = {
        name: studentName,
        q1: q1Answer.value
    };

    fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
});
