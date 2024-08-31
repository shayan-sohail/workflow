document.getElementById("create-workflow").addEventListener("click", function() {
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("create-workflow-screen").style.display = "block";
});

document.getElementById("save-workflow").addEventListener("click", function() {
    document.getElementById("create-workflow-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
});