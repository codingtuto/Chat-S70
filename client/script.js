import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

const loader = (element)=>{
  element.textContent = ''
   loadInterval = setInterval(()=>{
    // Mettre à jour le texte en affichant le loading 
    element.textContent += "." ;

    if(element.textContent === "...."){
      element.textContent = "";
    }

   }, 300);
}

const typeText = (element, text)=>{
  let index = 0

  let interval = setInterval(()=>{
  if (index < text.length){
    element.innerHTML += text.charAt(index)
    index++
  }else{
    clearInterval(interval)
  }
  },30) 
}

const generateUniqId = ()=>{
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

const chatStripe =(isAi, value, uniqueId)=>{
   
  return (
    `
    <div class="wrapper ${isAi && "ai"}">
    <div class="chat">
    <div class="profile">
   <img src=${isAi ? bot : user } alt="${isAi ? "bot" : "user"}" />
    </div>
    <div class="message" id=${uniqueId} >${value}</div>
    </div>
    </div>
    `
  )
}

const handleSubmit = async (e)=>{
e.preventDefault();

const data = new FormData(form) 

// Placeholder utilisateurs 
chatContainer.innerHTML += chatStripe(false, data.get("prompt"))

// après que L'utilisateur demande une question supprimer le texterea
form.reset();


// Bot/Robot placeholder

const uniqueId = generateUniqId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

// Robot: faire défiler vers le bas 

chatContainer.scrollTop = chatContainer.scrollHeight;

// div de message spécifique pour spécifier est ce bot ou utilisateur 

const messageDiv = document.getElementById(uniqueId);

// messageDiv.innerHTML = "..." loading

loader(messageDiv);


const response = await fetch("https://chatbot-sijj.onrender.com/", {
  method:"POST",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify({
    prompt:data.get("prompt")
  })
})
console.log(response);
clearInterval(loadInterval);
messageDiv.innerHTML = " "

if(response.ok){
  const data = await response.json();
  // trims supprime les espaces blancs/'\n
  const parsedData = data.bot.trim();

  typeText(messageDiv,parsedData);
}else{
  const err = await response.text();
  messageDiv.innerHTML = "Quelque chose s'est mal passé, réessayez plus tard!"
  //alert(err) affiche un popup contenant les erreurs 
}

}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup",(e)=>{
  if(e.keyCode === 13){
    handleSubmit(e)
  }
})

