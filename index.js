var attempt = 3; 
// Variable to count number of attempts.
// Below function Executes on click of login button.
var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
  };


function validate(){
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if ( username == "admin@gmail.com" && password == "123"){
alert ("Login successfully");
window.location = "index.html"; // Redirecting to other page.
return false;
}
else{
attempt --;// Decrementing by one.
alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
if( attempt == 0){
document.getElementById("username").disabled = true;
document.getElementById("password").disabled = true;
document.getElementById("submit").disabled = true;
return false;
}
}
}




let learn = document.querySelector("#sections")

if(learn){

   fetch('/images')
   .then(res => res.json())
   .then(res => {
       res.forEach(image =>{
         const img = document.createElement('img')
         img.src = `/uploads/${image}`

         learn.appendChild(img)  //Node.appendChild() method adds a node to the end of the list of children of a specified parent node.
       })
   });



}