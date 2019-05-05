var attempt = 3; 
// Variable to count number of attempts.
// Below function Executes on click of login button.
var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
  };

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
