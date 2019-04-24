const main = document.querySelector(".main");
const start = document.querySelector(".main__button");

let allAnswers = [];
let corrects = [];
let game = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  increaseCorrect: function(){
    this.correct++;
  },
  increaseIncorrect: function(){
    this.incorrect++;
  },
  increaseUnanswered: function(value){
    this.unanswered += value;
  },
  getCorrect: function(){
    return this.correct;
  },
  getIncorrect: function(){
    return this.incorrect;
  },
  getUnanswered: function(){
    return this.unanswered;
  },
  reset: function(){
    this.correct = 0;
    this.incorrect = 0;
    this.unanswered = 0;
  }
};

let point = {
  gamesPlayed: 0,
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  increaseGamesPlayed: function(){
    this.gamesPlayed++;
  },
  increaseCorrect: function(correct){
    this.correct += correct;
  },
  increaseIncorrect: function(incorrect){
    this.incorrect += incorrect;
  },
  increaseUnanswered: function(value){
    this.unanswered += value;
  },
  getGamesPlayed: function(){
    return this.gamesPlayed;
  },
  getCorrect: function(){
    return this.correct;
  },
  getIncorrect: function(){
    return this.incorrect;
  },
  getUnanswered: function(){
    return this.unanswered;
  },
  getWinrate: function(){
    let totalQuestions = this.getCorrect() + this.getIncorrect() + this.getUnanswered();
    return Math.floor((this.getCorrect() / totalQuestions) * 100);
  }
};

 let nav = document.querySelector(".SideNav");
 let menu = document.querySelector(".top-bar__navigation-icon");

 let data = [];
   getData();
      trapFocus(document.querySelector(".dialog"));

      start.addEventListener("click", startQuiz);
      document.querySelector(".main__submit").addEventListener("click", check);
      document.querySelector(".restart").addEventListener("click", restart);
      document.querySelector(".close").addEventListener("click", close);

      let menuTabs = nav.querySelectorAll(".button");
      for (let tab of menuTabs){
        tab.addEventListener("click", showInfo);
      }

      menu.addEventListener("click", function(){
        nav.style.width = "250px";
      });

      nav.addEventListener("mouseleave", function(){
        nav.style.width = "0";
      });


      function startQuiz(){
        document.querySelector(".main__questions-container").innerHTML = "";
        nav.style.width = "0";
        game.reset();

        if (start.classList.contains("main__button--visible") && !main.classList.contains("main--visible")) {
          start.classList.toggle("main__button--visible");
          main.classList.toggle("main--visible");
        }
        document.querySelector(".main__title").textContent = "Quiz" + (point.getGamesPlayed() + 1);
        createQuestions();

        getData();
      }

      function showInfo(){
        nav.style.width = "0";

        let info = document.querySelector(".info");
        info.innerHTML = "";

        if (this.id === "start") {
          info.visible = "false";
          if (!start.classList.contains("main__button--visible")) {
            start.classList.toggle("main__button--visible");
          }
        } else {
            if (start.classList.contains("main__button--visible")) {
              start.classList.toggle("main__button--visible");
            }
          info.visible = "true";

          if (this.id === "stats") {
            let headers = ["Games Played", "Correct Answer", "Incorrect Answer", "Unanswered", "Correct Persentage"];
            texts = [point.getGamesPlayed(), point.getCorrect(), point.getIncorrect(),point.getUnanswered(), point.getWinrate() + "%"];

            for (let i = 0; i < headers.length; i++) {
              let h3 = document.createElement("h3");
              h3.textContent = headers[i];
              info.appendChild(h3);

              let p = document.createElement("p");
              p.textContent = texts[i];
              info.appendChild(p);
            }
          } else if (this.id === "about") {
              let h3 = document.createElement("h3");
              h3.textContent = "About this app";
              info.appendChild(h3);

              let p = document.createElement("p");
              p.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." ;
              info.appendChild(p);
            }
        }
      }

      function check(){
        let answers = document.querySelectorAll(".question__answer:checked");

        point.increaseGamesPlayed();

        game.increaseUnanswered(corrects.length - answers.length);
        point.increaseUnanswered(game.getUnanswered());

        for (let answer of answers){
          if (answer.value === corrects[answer.dataset.pos]) {
            game.increaseCorrect();
          }else {
            game.increaseIncorrect();
          }
        }

      point.increaseCorrect(game.getCorrect());
      point.increaseIncorrect(game.getIncorrect());

      showResult();
      }

      function showResult(){
        document.querySelector(".dialog").classList.add("dialog--visible");

        let correct = game.getCorrect();

        let dialogTitle = document.querySelector(".dialog__title");
        if (correct >= 8) {
          dialogTitle.textContent = "Congratulations!";
        }
        else if (correct >= 5 && correct < 8) {
          dialogTitle.textContent = "Good jobb!";
        }
        else if (correct >= 3 && correct < 5) {
          dialogTitle.textContent = "Well done!";
        }
        else {
          dialogTitle.textContent = "failled!";
        }
        document.querySelector(".dialog__content").textContent = 'You got'  + correct/10 +  'correct!';
      }

      function restart(){
        document.querySelector(".dialog").classList.remove("dialog--visible");
        main.classList.remove("main--visible");
        start.classList.add("main__button-visible");
      }

      function close(){
        document.querySelector(".dialog").classList.remove("dialog--visible");
        main.classList.remove(".main--visible");
        start.classList.add("main__button--visible");
      }

      function createQuestions(){
        let noQuestion = 0;
        let noAnswers = [];
        for (let obj of data){
          noQuestion++;

          let question = document.createElement("div");
          question.setAttribute("class", "question question--sm");
          question.setAttribute("role", "presentation");
          question.setAttribute("aria-labelledby", "text" + noQuestion);

          let noText = document.createElement("h3");
          noText.classList.add("question__text");
          noText.textContent = "Q" + noQuestion + "." + decode(obj.question);
          noText.id = "text" + noQuestion;
          question.appendChild(noText);

          corrects.push(decode(obj.correct_answer));
          noAnswers.push(decode(obj.correct_answer));
          for (let incorrect of obj.incorrect_answers){
            noAnswers.push(decode(incorrect));
          }

          while (noAnswers.length > 0) {
            let i = Math.floor(Math.random() * noAnswers.length);

            let container = document.createElement("div");
            container.classList.add("question__answers");

            let answer = document.createElement("input");
            answer.classList.add("question__answer");
            answer.id = noAnswers[i];
            answer.type = "radio";
            answer.name = "q" + noQuestion;
            answer.dataset.pos = noQuestion - 1;
            answer.value = noAnswers[i];
            answer.setAttribute("aria-labelledby", noAnswers[i].split(".").join("-"));
            container.appendChild(answer);

            let label = document.createElement("label");
            label.classList.add("question__anwerText")
            label.textContent = noAnswers[i];
            label.id = noAnswers[i].split(" ").join("-");
            container.appendChild(label);

            question.appendChild(container);
            main.querySelector(".main__questions-container").appendChild(question);
            noAnswers.splice(i, 1);
          }
        }
      }

      function getData(){
        new Promise(function(resolve, refect){
          let req = new XMLHttpRequest();
          req.open("GET", "https://opentdb.com/api.php?amount=10");
          req.onload =function(){
            resolve(req.responseText);
          };
          req.send();
        }).then(function(result){
          data = JSON.parse(result).results;
        });
      }

      function decode(input){
        let doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
      }

      function trapFocus(element){
        let focusableEls = element.querySelectorAll(".button");
        let focusableEl = focusableEls[0]
        let lastFocusableEl = focusableEls[focusableEls.length-1];
        let KEYCODE_TAB = 9;

        element.addEventListener("keydown", function(e){
          let isTabPressed = (e.key === "Tab" || e.keyCode === KEYCODE_TAB);

          if (!isTabPressed) {
            return;
          }

          if (e.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
              e.preventDefault();
            }
          }
            else {
              if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
              }
            }
        });
      }
