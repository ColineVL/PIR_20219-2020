function geek() {
    var doc = prompt("Please enter some text",
        "GeeksforGeeks");
    if (doc != null) {
        console.log(5);
        document.getElementById("g").innerHTML =
            "Welcome to " + doc;
    }
}