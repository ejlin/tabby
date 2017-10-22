/* File Name: index.js
 */

 function setup_index()
 {
   var signout_heading = document.getElementById("signout_heading");
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       signout_heading.innerHTML = user.displayName;
       var arrow = document.createElement("IMG");
       arrow.src = "/Images/drop_arrow.png";
       arrow.style.width = "40px";
       arrow.style.height = "40px";
       arrow.style.float = "right";
       arrow.style.marginTop = "-7px";

       signout_heading.appendChild(arrow);
       signout_heading.style.cursor = "pointer";
       signout_heading.onclick = function()
       {
         var signout_dropdown = document.getElementById("signout_dropdown");
         signout_dropdown.style.display = "block";
         signout_dropdown.style.cursor = "pointer";
         signout_dropdown.className += " hover_div";
         arrow.src = "/Images/up_arrow.png";
         signout_heading.onclick = function()
         {
           signout_dropdown_hide(signout_heading, signout_dropdown, arrow);
         }
         signout_dropdown.onclick = function()
         {
           firebase.auth().signOut().then(function() {
             console.log('Signed Out');
             signout_dropdown.style.display = "none";
           }, function(error) {
             console.error('Sign Out Error', error);
           });        }
       }
     } else {
       signout_heading.innerHTML = "Login";
       signout_heading.style.cusor = "pointer";
       signout_heading.onclick = function()
       {
         window.location = "/login";
       }
     }
   });
 }

 function signout_dropdown_hide(signout_heading, signout_dropdown, arrow)
 {
   arrow.src = "/Images/drop_arrow.png";
   signout_dropdown.style.display = "none";
   signout_heading.onclick = function()
   {
     arrow.src = "/Images/up_arrow.png";
     signout_dropdown.style.display = "block";
     signout_heading.onclick = function()
     {
       signout_dropdown_hide(signout_heading, signout_dropdown, arrow);
     }
   }
 }
