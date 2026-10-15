/* ============================================================
   Reusable quiz widget
   Usage:
     <div class="quiz"
          data-question="問題文字"
          data-correct="0"          <- index of correct option
          data-explain="解說（可選）">
       <button class="opt">選項一</button>
       <button class="opt">選項二</button>
       <button class="opt">選項三</button>
       <button class="opt">選項四</button>
     </div>
   Behavior: click to answer. Wrong pick marks red and allows
   retry without revealing the answer; correct pick locks green.
   ============================================================ */
(function () {
  function init() {
    var quizzes = document.querySelectorAll(".quiz[data-question]");
    quizzes.forEach(function (quiz) {
      var q = document.createElement("div");
      q.className = "q";
      q.textContent = quiz.getAttribute("data-question");
      quiz.insertBefore(q, quiz.firstChild);

      var options = quiz.querySelectorAll("button.opt");
      var feedback = document.createElement("div");
      feedback.className = "feedback";
      quiz.appendChild(feedback);

      options.forEach(function (opt, i) {
        opt.setAttribute("data-i", String(i));
      });

      var done = false;
      options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (done) return;
          var idx = opt.getAttribute("data-i");
          var correct = quiz.getAttribute("data-correct");
          if (idx === correct) {
            opt.classList.add("correct");
            feedback.className = "feedback good";
            feedback.textContent = "答對了 ✓";
            done = true;
            var explain = quiz.getAttribute("data-explain");
            if (explain) {
              var e = document.createElement("div");
              e.className = "explain";
              e.textContent = explain;
              quiz.appendChild(e);
            }
          } else {
            opt.classList.add("wrong");
            feedback.className = "feedback bad";
            feedback.textContent = "再想想，答案不是這個";
          }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
