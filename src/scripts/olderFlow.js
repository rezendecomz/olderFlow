/* TODO
- Bugfix on recent answers with 'yesteday' and other things
- Create an option to not use "warning function"
- Show on Google/Duck/Bing/Yahoo a color tag 'Asked about two years ago'(based on on: https://stackoverflow.com/questions/:id)
- Create an option to customize title
- Customize emojis
- Customize color/time/emoji
- Copy codeblocks to clipboard
*/

let dateNow = new Date();
let warningState = true;
let emojiState = true;

function qSelector(select) {
  return document.querySelector(select)
}
function timeStyleAndProcessing(date, div, warningIsOn, emojiOnTitle) {
  div.style.color = 'white'
  div.style.padding = '5px 8px 5px 8px'
  div.style.borderRadius = '20px'
  let daysInHSL = parseInt((360 * differenceInDays(date)) / 3600) // 360 (HSL max value), 3600 (10 years) 
  if (daysInHSL > 360) {
    div.style.backgroundColor = `hsl(360, 100%, 60%)`
  } else if (daysInHSL < 90) {
    div.style.backgroundColor = `hsl(90, 100%, 60%)`
  }
  else {
    div.style.backgroundColor = `hsl(${daysInHSL}, 100%, 60%)`
  }
  if (daysInHSL < 190) {
    div.style.color = 'black'
  }
  if (warningIsOn == true) warning(div, emojiOnTitle)
}
function differenceInDays(date) {
  let differenceInTime = dateNow.getTime() - date.getTime();
  return parseInt(differenceInTime / (1000 * 3600 * 24)); 
}
function warning(div, emojiOnTitle) {
  let emoji = '';
  // TODO: Check system support for Unicode 12
  function emojiStatus(status) {
    if (status == 'older') emoji = '💾';
    if (status == 'old') emoji = '💿';
    if (status == 'new') emoji = '✳️';
    if (status == 'hot') emoji = '🔥';
  }
  function titleEmoji() {
    let newTitle = `${emoji} `+ document.querySelector('title').textContent
    qSelector('title').textContent = newTitle
  }
  
  questionDateDiv.style.borderRadius = '20px 0px 0px 20px'
  div.outerHTML += '<span id="warning"></span>';
  let warningStyle = qSelector('#warning')
  warningStyle.style.color = 'white'
  warningStyle.style.backgroundColor = 'green'
  warningStyle.style.padding = '5px 8px 5px 5px'
  warningStyle.style.borderRadius = '0px 20px 20px 0px'
  
  function es6() {
    warningStyle.innerText = 'ES6';
    warningStyle.style.backgroundColor = 'green'
    emojiStatus('old')
  }
  function preES6() {
    warningStyle.innerText = 'pre-ES6';
    warningStyle.style.backgroundColor = 'orange'
    emojiStatus('older')
  }
  function es6Plus(isHot) {
    warningStyle.innerText = 'ES6+';
    if (isHot) {
      emojiStatus('hot')
    } else {
      emojiStatus('new')      
    }
    warningStyle.style.backgroundColor = `rgb(50, 205, 50)`
  }
  if (questionDate.getFullYear() > 2016 && (dateNow.getTime() - questionDate.getTime()) < 1.555e+10) { // 180 days
    es6Plus(true); }
    else if (questionDate.getFullYear() > 2016) {
    es6Plus(false);
  } else if (questionDate.getFullYear() == 2016 && questionDate.getMonth() > 4) {
    es6Plus(false);
  } else if (questionDate.getFullYear() == 2016) {
    es6();    
  } else if (questionDate.getFullYear() == 2015 && questionDate.getMonth() > 4) {
    es6();
  } else {
    preES6();
  }
  if (emojiOnTitle) titleEmoji();
}

// Question
let questionDateDiv = qSelector('time')
let questionDate = new Date(questionDateDiv.dateTime)
timeStyleAndProcessing(questionDate, questionDateDiv, warningState, emojiState)

// Answers (edited)
let answersAll = Array.from(document.querySelectorAll('.relativetime'))

answersAll.forEach(div => {
  let answerDate = new Date(div.title)
  div.style.backgroundColor = `rgb(50, 205, 50)`
  timeStyleAndProcessing(answerDate, div, false, false)
})

// First Answer
var regExp = /^[a-zA-Z]+$/;
let firstAnswerDiv = document.getElementsByClassName('answer')[0].getElementsByClassName('relativetime')[0]
let firstAnswerYear = 20 + firstAnswerDiv.innerText.split(' ')[2].slice(1)
let firstAnswerDate = new Date(firstAnswerYear, 5)
let firstAnswerText = ''

const firstAnswerLinkDiv = document.querySelector('div.ws-nowrap:nth-child(1)')
var is_date = function(input) {
  if ( Object.prototype.toString.call(input) === "[object Date]" ) 
    return false;
  return true;   
    };
if (is_date(firstAnswerYear)) { // Is recent?
  firstAnswerText = firstAnswerDiv.innerText;
  firstAnswerLinkDiv.outerHTML += `<a><div class="grid--cell ws-nowrap mr16 mb8"><span id="answerLink">✅: <span style="text-shadow: 2px 2px 7px white; background-color: hsl(90, 100%, 60%); border-radius: 20px; padding: 5px 8px 5px 8px">${firstAnswerText}</span></span></div></a>`;
} else { // Has 4 numbers on date
  firstAnswerText = firstAnswerDate.getFullYear()
  firstAnswerLinkDiv.outerHTML += `<a><div class="grid--cell ws-nowrap mr16 mb8"><span id="answerLink">✅: <span style="text-shadow: 2px 2px 7px white;">${firstAnswerText}</span></span></div></a>`;
  timeStyleAndProcessing(firstAnswerDate, document.getElementById('answerLink'), false, false)
}

// Answer Redirect
let answerLink = document.getElementById('answerLink')
let acceptedAnswer = document.getElementById('answers') // document.querySelector(".accepted-answer");
answerLink.addEventListener('click', () => {
  acceptedAnswer.scrollIntoView();
})

// Direct to accept answer
let loc = window.location.search;
if (loc == "?direct") {
  acceptedAnswer.scrollIntoView();
}

// Copy code // WIP // Provavelmente o usuário precisa disparar clicando em algum coisa, mas não do jeito que tá agora
// Armazenar antes todos os códigos
// Colocar um addEvent... para escutar todos os botoes, indentificar o botao e copiar o innerText certo
function copyCode(text) {
  return navigator.clipboard.writeText(text)
}

pre = document.querySelectorAll('pre')

pre.forEach(code => {
  let codeToCopy = code.innerText
  code.innerHTML += `<br><button onclick="copyCode(${codeToCopy})">Copy</button>`
  console.log(codeToCopy)
})


