(function(){
  document.addEventListener('mousemove', function(e){
    document.documentElement.style.setProperty('--gx', e.clientX+'px');
    document.documentElement.style.setProperty('--gy', e.clientY+'px');
  });

  var bar = document.getElementById('progress');
  window.addEventListener('scroll', onScroll);

  var lines = [
    '> scanning: missed chats, slow follow-up, disconnected tools... <span class="warn">detected</span>',
    '> diagnosis: systems gap',
    '> engineer: isidro_dadula  <span class="dim">[15+ yrs, AI-native, connected environments]</span>',
    '> status: <b style="color:#48d99a">READY</b>'
  ];
  var term = document.getElementById('term');
  var i = 0;
  function typeNext(){
    if(i >= lines.length) return;
    var el = document.createElement('div');
    el.className = 'term-line';
    el.innerHTML = lines[i] + (i===lines.length-1 ? '<span class="caret"></span>' : '');
    term.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    i++;
    setTimeout(typeNext, 480);
  }
  setTimeout(typeNext, 300);

  // reveal-on-scroll
  var items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, {threshold:0.15});
  items.forEach(function(it){ obs.observe(it); });

  // draw flow-svg paths once in view
  var flowDrawn = false;
  var flowObs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting && !flowDrawn){
        flowDrawn = true;
        document.querySelectorAll('.flow-path').forEach(function(p, idx){
          var len = p.getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          setTimeout(function(){
            p.style.transition = 'stroke-dashoffset 1.1s ease';
            p.style.strokeDashoffset = 0;
          }, idx*140);
        });
      }
    });
  }, {threshold:0.3});
  var fw = document.getElementById('flow-wrap');
  if(fw) flowObs.observe(fw);

  // scroll-linked progress vars: timeline fill + bar charts
  var linked = [];
  var timelineEl = document.getElementById('timeline');
  if(timelineEl) linked.push(timelineEl);
  ['bar1','bar2','bar3','bar4'].forEach(function(id){
    var b = document.getElementById(id);
    if(b) linked.push(b.closest('.bar-row'));
  });

  function progressFor(el){
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.85;
    var end = vh * 0.3;
    var p = (start - r.top) / (start - end);
    if(p < 0) p = 0; if(p > 1) p = 1;
    return p;
  }

  var ticking = false;
  function onScroll(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
    if(!ticking){
      ticking = true;
      requestAnimationFrame(function(){
        linked.forEach(function(el){
          if(!el) return;
          el.style.setProperty('--sp', progressFor(el));
        });
        ticking = false;
      });
    }
  }
  onScroll();
})();