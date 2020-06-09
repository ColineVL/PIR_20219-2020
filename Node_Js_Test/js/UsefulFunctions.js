function geek() {
    var doc = prompt("Please enter some text",
        "GeeksforGeeks");
    if (doc != null) {
        console.log(5);
        doc = Date.now();
        document.getElementById("g").innerHTML =
            "Welcome to " + doc;
    }
}


function loadXMLDoc(truc) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("g").innerHTML =
                this.responseText;
        }
    };
    xhttp.open("GET", "test2/" + truc, true);
    xhttp.send();
}

var myVar = setInterval(myTimer, 2000);
function myTimer() {
    var d = new Date();
    document.getElementById("g").innerHTML = d.toLocaleTimeString();
}