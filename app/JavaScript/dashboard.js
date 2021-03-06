function updateDashCards(eventList) {
  var cardContainer = document.getElementById("dash_card_container");

  while (cardContainer.childNodes.length > 0) {
    cardContainer.removeChild(cardContainer.lastChild);
  }

  if(eventList == null) {

    var cardContainer = document.getElementById("dash_card_container");
    var servicesText = document.createElement("P");
    servicesText.innerHTML = "Don't have any Tabbs yet? Head over to the Services section to create some!";
    servicesText.style.color = "white";
    servicesText.style.fontSize = "28px";
    servicesText.style.marginLeft = "10%";
    servicesText.style.float = "left";

    var direct_arrow = document.createElement("IMG");
    direct_arrow.src = "/Images/direct_arrow.png";
    direct_arrow.style.float = "right";
    direct_arrow.style.width = "95px";
    direct_arrow.style.height = "150px";
    direct_arrow.style.marginRight = "15%";
    direct_arrow.style.marginTop = "-85px";
    cardContainer.appendChild(servicesText);
    cardContainer.appendChild(direct_arrow);
    return;
  }
  var counter = 0;
  for (newEvent in eventList) {
    let scopedEvent = newEvent;

    var eventObj = eventList[newEvent];
    var newCard = document.createElement("DIV");
    newCard.className = "dashboard_card";
    if (counter++ % 3 == 0)
    {
      newCard.style.marginLeft = "calc(((100% - 1150px) / 2))";
    }


    var newParagraph = document.createElement("P");
    newParagraph.style.color = "white";
    newParagraph.style.fontSize = "24px";
    newParagraph.innerHTML = eventObj.eventName;

    var newPrice = document.createElement("P");
    newPrice.style.color = "white";
    newPrice.style.fontSize = "24px";
    newPrice.innerHTML = "You Pay: $"+ (eventObj.amountPaying.toFixed(2));
    newPrice.style.marginTop = "-15px";
    newCard.style.textAlign = "center";
    newCard.appendChild(newParagraph);
    newCard.appendChild(newPrice);
    cardContainer.appendChild(newCard);

    if(eventObj.ownerEmail == firebase.auth().currentUser.email)
    {
      var trash = document.createElement("IMG");
      var star = document.createElement("IMG");
      star.src = "/Images/star.png";
      trash.id = "trash_icon";
      trash.onclick = () => {deleteEvent(scopedEvent)};
      trash.src = "/Images/delete.png";
    //  newCard.appendChild(star);
      newCard.appendChild(star);
      star.className += " dashboard_star_icon hover_div";
      newCard.appendChild(trash);
      trash.className += " dashboard_trash_icon hover_div";
    }
    newCard.onclick = function(event)
    {
      if (event.target.id != "trash_icon" )
      {
        view_tab(scopedEvent);
      }
    }
  }
}

function deleteEvent(eventId) {
  console.log(eventId);
  var eventRef = firebase.database().ref("events/" + eventId);
  var usersList = [];
  eventRef.once('value').then(function(snapshot){
    var jsObject = snapshot.exportVal();
    console.log(jsObject);
    usersList.push(jsObject.ownerID);
    var debtors = jsObject.debtors;

    if(debtors != null) {
      var memberMap = debtors.members_map;
      if(memberMap != null) {
        for(member in memberMap) {
          usersList.push(member);
        }
      }

      var inviteeMap = debtors.invitee_map;
      if(inviteeMap != null) {
        for(invitee in inviteeMap) {
          usersList.push(invitee);
        }
      }
    }

    console.log(usersList);
    eventRef.remove();
    for(idx in usersList) {
      var eventRefPath = "users/" + usersList[idx] + "/eventList/" + eventId;
      console.log(eventRefPath);
      var eventListEventRef = firebase.database().ref(eventRefPath);
      eventListEventRef.remove();
    }
  });
}

function setup_dashboard()
{
  var signout_heading = document.getElementById("signout_heading");
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var dashboard_search_bar = document.getElementById("dashboard_search_bar");
      dashboard_search_bar.style.display = "block";
      if (localStorage.getItem("name"))
      {
        signout_heading.innerHTML = localStorage.getItem("name");
      }
      else
      {
        signout_heading.innerHTML = user.displayName;
      }
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
            window.location = "/";
            signout_dropdown.style.display = "none";
          }, function(error) {
            console.error('Sign Out Error', error);
          });        }
      }
      attachDataListener();
    } else {
      signout_heading.innerHTML = "Login";
      signout_heading.style.cusor = "pointer";
      signout_heading.onclick = function()
      {
        window.location = "/login";
      }

      var cardContainer = document.getElementById("dash_card_container");
      var servicesText = document.createElement("P");
      if (cardContainer.childElementCount == 0) {
        servicesText.innerHTML = "Don't have any Tabbs yet? Head over to the Services section to create some!";
        servicesText.style.color = "white";
        servicesText.style.fontSize = "28px";
        servicesText.style.marginLeft = "10%";
        servicesText.style.float = "left";

        var direct_arrow = document.createElement("IMG");
        direct_arrow.src = "/Images/direct_arrow.png";
        direct_arrow.style.float = "right";
        direct_arrow.style.width = "95px";
        direct_arrow.style.height = "150px";
        direct_arrow.style.marginRight = "15%";
        direct_arrow.style.marginTop = "-85px";
        cardContainer.appendChild(servicesText);
        cardContainer.appendChild(direct_arrow);
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

function to_signout()
{
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

  } else {
    // No user is signed in.
  }
});
}

// Loads user data.
function attachDataListener() {
  // Reference to the /users/ database path.
  var refPath = "users/" + emailToURL(firebase.auth().currentUser.email);
  var userRef = firebase.database().ref(refPath);
  // Make sure we remove all previous listeners.
  userRef.off();
  userRef.on('value',
  	function(snapshot) {
  		updateDashCards(snapshot.child("eventList").val());
  	},
  	function(errorCode){
  		console.log(errorCode)
  	}
  );
};

function emailToURL(email) {
  return email.replace(/\./g,'-');
}
