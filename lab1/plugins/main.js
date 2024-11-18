// Include this script to include everything you need.

(function() {
  const head = document.getElementsByTagName('head')[0];

  function includeScript(src, text) {
    const script = document.createElement('script');
    script.src = src;
    if (text) script.text = text;
    head.appendChild(script);
    return script;
  }

  function includeStylesheet(href) {
    const css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('href', href);
    head.appendChild(css);
    return css;
  }

  function initMathJax(scriptLocation, fallbackScriptLocation) {
    if (typeof(sfig) != 'undefined') return;  // Already loaded through sfig
    const script = includeScript(scriptLocation);
    let buf = '';
    buf += 'MathJax.Hub.Config({';
    buf += '  extensions: ["tex2jax.js", "TeX/AMSmath.js", "TeX/AMSsymbols.js"],';
    buf += '  tex2jax: {inlineMath: [["$", "$"]]},';
    buf += '});';
    script.innerHTML = buf;

    // If fail, try the fallback location
    script.onerror = function() {
      if (fallbackScriptLocation)
        initMathJax(fallbackScriptLocation, null);
    }
  }

  initMathJax('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=default');

  includeScript('plugins/jquery.min.js');
  includeStylesheet('plugins/main.css');
})();

function fixScrollPosition() {
  let store = {};
  if (typeof(localStorage) != 'undefined' && localStorage != null) store = localStorage;

  const scrollTopKey = window.location.pathname+'.scrollTop';
  // Because we insert MathJax, we lose the scrolling position, so we have to
  // put it back manually.
  window.onscroll = function() {
    store[scrollTopKey] = document.body.scrollTop;
  }
  if (store.scrollTop)
    window.scrollTo(0, store[scrollTopKey]);
}

function onLoad(assignmentId, task, version) {
  // Insert generic text
  const header = $('#assignmentHeader');

  header.append($('<div>')
    .append($('<div>', {class: 'assignmentTitle'}).append(document.title))
    .append($('<div>').append(''.bold())));
  header.append($('<p>').append('Практичне завдання: ' + task));
  header.append($('<p>').append('Версія: ' + version));

  header.append('<hr>');
  header.append($('<div>', {class: 'problemTitle'}).append('Загальні інструкції'));

  const ol = $('<ol>').addClass('problem');
  ol.append($('<li>').addClass('code').addClass('template').append('Цей значок означає, що ви повинні написати код у <code>submission.py</code>.'));
  header.append(ol);

  header.append($('<p>').append(
    'Розв\'язок до кожної функції слід розмістити у <code> submission.py </code> між рядками' +
    '<pre># BEGIN_YOUR_CODE</pre> та <pre># END_YOUR_CODE</pre> ' +
    'Якщо є потреба, Ви можете додавати інші допоміжні функції поза цим блоком.'));

    header.append($('<p>').append(
    ' Не вносьте зміни до інших файлів, окрім <code>submission.py</code>.' +
    ' та не перейменовуйте назви функцій, які Вам потрібно реалізувати у файлі <code>submission.py</code>. '));

  header.append($('<p>').append(
    'Ваш код буде оцінено на двох типах тестів: <b>basic</b> та <b>hidden</b>. Їх Ви можете знайти у <code>grader.py</code>. ' +
    'Основні тести, які Вам повністю надаються, не випробують Ваш код великими вхідними даними і не перевіряють хитромудрими граничними умовами.' +
    ' Приховані тести складніші і випробують Ваш код. Вхідні дані прихованих тестів надаються в <code>grader.py</code>, але правильні результати - ні. ' +
    'Вони надаються Вам для того, щоб переконатися, що функції не виходять з ладу та не потребують більше ніж відведено часу на виконання. ' +
    'Щоб запустити тести переконайтесь, щоб файли <code>graderUtil.py</code>, <code>submission.py</code> та <code>grader.py</code> знаходились в одному каталозі (директорії). ' +
    'Далі, щоб запустити усі тести, наберіть команду: <pre>python3 grader.py</pre> ' +
    'Це укаже Вам на те, чи пройшли ваші розв\'язки  основні тести та відобразить отримані бали. ' +
    'На прихованих тестах сценарій попередить Вас, якщо ваші розв\'язки потребують занадто багато часу для виконання або виходять з ладу, але не покаже, чи отримали Ви правильний результат. ',
    'Ви також можете запускати окремі тести (наприклад, <code>1a-0-basic</code>) набравши: <pre>python3 grader.py 1a-0-basic</pre>',
    'Наполегливо рекомендую читати тестові приклади, створювати власні за потреби, а не просто всліпу запускати <code>grader.py</code>.'));

  header.append('<hr>');

  // Link to code (any mention of *.py).
  $('code').each(function(i, elem) {
    if (true)  {
      const value = elem.innerHTML;
      if (value.match(/.py$/))
        elem.innerHTML = '<a href="' + value + '">' + value + '</a>';
    }
  });

  // Render point values
  const maxPoints = {};  // Part to number of maxPoints
  function updatePoints(part) {
    const partName = part['number'].split('-')[0];
    maxPoints[partName] = (maxPoints[partName] || 0) + part['maxPoints'];
  }
  allResult.tests.forEach(updatePoints);

  function showPoints(i, p) {
    if (!p.attributes.id) {
      console.log("Missing id attribute in", p);
      return;
    }
    const partName = p.attributes.id.value;
    const n = maxPoints[partName];
    const s = '[' + n + ' бали' + (n > 1 ? '' : '') + ']';
    $(p).prepend(s);
  }
  $('.code').not('.template').each(showPoints);

  fixScrollPosition();
}
