//random whole number between 0 and x: "Math.floor(Math.random() * x);"
document.querySelector("#testWin").addEventListener('click', function(){
    document.querySelector("#victory").style.visibility = "visible";
    document.querySelector("main").style.visibility = "hidden";
    document.querySelector("header").style.visibility = "hidden";
    console.log("element was clicked");
})
document.querySelector("#restart").addEventListener('click', function(){
    document.querySelector("#victory").style.visibility = "hidden";
    document.querySelector("main").style.visibility = "visible";
    document.querySelector("header").style.visibility = "visible";
    console.log("element was clicked");
})