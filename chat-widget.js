(function () {

  var widget = document.getElementById('chat-widget');
  var toggle = document.getElementById('chat-toggle');
  var closeBtn = document.getElementById('chat-close');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var log = document.getElementById('chat-messages');

  if (!widget) return;

  var history = [];

  toggle.addEventListener('click', function () {
    widget.classList.toggle('open');
    if (widget.classList.contains('open')) input.focus();
  });

  closeBtn.addEventListener('click', function () {
    widget.classList.remove('open');
  });

  function addMessage(role, text) {
    var el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'chat-msg--user' : 'chat-msg--bot');
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.disabled = true;

    var thinking = document.createElement('div');
    thinking.className = 'chat-msg chat-msg--bot';
    thinking.textContent = '...';
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        thinking.remove();
        var reply = data.reply || 'Não consegui responder agora. Chama a gente no WhatsApp.';
        addMessage('bot', reply);
        history.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        thinking.remove();
        addMessage('bot', 'Deu um erro aqui. Chama a gente no WhatsApp.');
      })
      .finally(function () {
        input.disabled = false;
        input.focus();
      });
  });

})();
