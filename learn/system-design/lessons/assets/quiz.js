/* Shared quiz widget for system-design lessons */
(function () {
  "use strict";

  function initQuiz(el) {
    const data = JSON.parse(el.dataset.quiz);
    const questions = data.questions;
    let current = 0;
    let score = 0;

    function render() {
      if (current >= questions.length) {
        el.innerHTML =
          '<h3>測驗完成</h3><p>你答對了 ' + score + '/' + questions.length + ' 題。</p>';
        return;
      }
      var q = questions[current];
      var html = '<h3>問題 ' + (current + 1) + '/' + questions.length + '</h3>';
      html += '<p>' + q.question + '</p>';
      html += '<ul class="options">';
      q.options.forEach(function (opt, i) {
        html += '<li data-idx="' + i + '">' + opt + '</li>';
      });
      html += '</ul>';
      html += '<div class="feedback"></div>';
      html += '<button disabled>確認</button>';
      el.innerHTML = html;

      var options = el.querySelectorAll(".options li");
      var btn = el.querySelector("button");
      var selected = -1;
      var answered = false;

      options.forEach(function (li) {
        li.addEventListener("click", function () {
          if (answered) return;
          options.forEach(function (o) { o.classList.remove("selected"); });
          li.classList.add("selected");
          selected = parseInt(li.dataset.idx);
          btn.disabled = false;
        });
      });

      btn.addEventListener("click", function () {
        if (answered) {
          current++;
          render();
          return;
        }
        if (selected < 0) return;
        answered = true;
        var correct = selected === q.answer;
        if (correct) { score++; options[selected].classList.add("correct"); }
        else {
          options[selected].classList.add("wrong");
          options[q.answer].classList.add("correct");
        }
        var fb = el.querySelector(".feedback");
        fb.textContent = correct ? "答對了！" : "正確答案：" + q.options[q.answer];
        fb.className = "feedback " + (correct ? "correct" : "wrong");
        btn.textContent = current < questions.length - 1 ? "下一題" : "查看結果";
        btn.disabled = false;
      });
    }
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz[data-quiz]").forEach(initQuiz);
  });
})();
