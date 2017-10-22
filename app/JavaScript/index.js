/* File Name: index.js
 */

 function setup_index()
 {
   var signout_heading = document.getElementById("signout_heading");
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       signout_heading.innerHTML = user.email;
       signout_heading.style.cursor = "pointer";
       signout_heading.onclick = function()
       {
         var signout_dropdown = document.getElementById("signout_dropdown");
         signout_dropdown.style.display = "block";
         signout_dropdown.style.cursor = "pointer";
         signout_dropdown.className += " hover_div";
         signout_heading.onclick = function()
         {
           signout_dropdown_hide(signout_heading, signout_dropdown);
         }
         signout_dropdown.onclick = function()
         {
           //TODO: Sign them out
         }
       }
     } else {
       signout_heading.innerHTML = "Login";
       signout_heading.style.cusor = "pointer";
       console.log("here");
       signout_heading.onclick = function()
       {
         window.location = "login.html";
       }
     }
   });
 }

 function signout_dropdown_hide(signout_heading, signout_dropdown)
 {
   signout_dropdown.style.display = "none";
   signout_heading.onclick = function()
   {
     signout_dropdown.style.display = "block";
     signout_heading.onclick = function()
     {
       signout_dropdown_hide(signout_heading, signout_dropdown);
     }
   }
 }
