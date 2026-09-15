(function(){
  // ambient cursor glow
  document.addEventListener('mousemove', function(e){
    document.documentElement.style.setProperty('--gx', e.clientX+'px');
    document.documentElement.style.setProperty('--gy', e.clientY+'px');
  });

  // scroll progress
  var bar = document.getElementById('progress');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  });

  // boot terminal
  var lines = [
    '> initializing profile...',
    '> loading node: isidro_dadula  <span class="dim">[BS Computer Engineering / 15+ yrs]</span>',
    '> role: AI-Native Systems Architect',
    '> environment: connected  ·  agents: online  ·  status: <b style="color:#48d99a">READY</b>'
  ];
  var term = document.getElementById('term');
  var i = 0;
  function typeNext(){
    if(i >= lines.length){
      document.getElementById('gate-content').classList.add('in');
      return;
    }
    var el = document.createElement('div');
    el.className = 'term-line';
    el.innerHTML = lines[i] + (i===lines.length-1 ? '<span class="caret"></span>' : '');
    term.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    i++;
    setTimeout(typeNext, 420);
  }
  setTimeout(typeNext, 300);

  // unlock
  var main = document.getElementById('main');
  var gate = document.getElementById('gate');
  function unlock(){
    main.classList.add('unlocked');
    try{ sessionStorage.setItem('dd_unlocked','1'); }catch(e){}
    setTimeout(function(){
      gate.scrollIntoView({block:'start'});
      window.scrollBy({top: gate.offsetHeight, behavior:'smooth'});
    }, 50);
    initReveal();
  }
  document.getElementById('unlockBtn').addEventListener('click', unlock);
  try{ if(sessionStorage.getItem('dd_unlocked')==='1'){ main.classList.add('unlocked'); } }catch(e){}

  // scroll reveal
  var revealed = false;
  function initReveal(){
    if(revealed) return; revealed = true;
    var items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, {threshold:0.15});
    items.forEach(function(it){ obs.observe(it); });

    // counters
    var counters = document.querySelectorAll('[data-count]');
    var cobs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el = en.target;
          var target = parseFloat(el.getAttribute('data-count'));
          var suffix = el.getAttribute('data-suffix') || '';
          var isDecimal = String(target).indexOf('.') > -1;
          var dur = 1100, start = null;
          function step(ts){
            if(!start) start = ts;
            var p = Math.min((ts-start)/dur, 1);
            var val = target * p;
            el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
            if(p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          cobs.unobserve(el);
        }
      });
    }, {threshold:0.4});
    counters.forEach(function(c){ cobs.observe(c); });
  }
  if(main.classList.contains('unlocked')) initReveal();
})();