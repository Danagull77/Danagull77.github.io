document.addEventListener('DOMContentLoaded', function(){
  const fs = document.getElementById('fs');
  const fsText = fs ? fs.querySelector('.content span') : null;

  function openFullscreen(text){
    if(!fs || !fsText) return;
    fsText.textContent = text || '';
    fs.classList.remove('hidden');
    fs.setAttribute('aria-hidden', 'false');
  }

  function closeFullscreen(){
    if(!fs) return;
    fs.classList.add('hidden');
    fs.setAttribute('aria-hidden', 'true');
  }

  // Normalize data-fs-text values (line breaks and bullets)
  document.querySelectorAll('[data-fs-text]').forEach(function(el){
    var text = el.getAttribute('data-fs-text') || '';
    text = text.replace(/\\n\\n/g, '\n');
    text = text.replace(/-\s/g, '\n');
    el.setAttribute('data-fs-text', text.trim());
  });

  // Handle all clickable elements with data-fs-text
  document.querySelectorAll('[data-fs-text]').forEach(function(element){
    element.addEventListener('click', function(){
      const text = element.getAttribute('data-fs-text') || '';
      openFullscreen(text);
    });
  });

  if(fs){
    fs.addEventListener('click', closeFullscreen);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeFullscreen(); });
  }

  // Slider logic
  (function(){
    var slider = document.querySelector('.slider');
    if(!slider) return;
    var slides = slider.querySelector('.slides');
    var groups = Array.from(slides.querySelectorAll('.slide-group'));
    var index = 0;

    // Ensure the track width equals sum of slides (optional for flex-based layout)
    // slides.style.width = (groups.length * 100) + '%';

    function update(){
      slides.style.transform = 'translateX(' + (-index * 100) + '%)';
    }
    var prev = slider.querySelector('.slider-controls .prev');
    var next = slider.querySelector('.slider-controls .next');
    function onPrev(e){ e.preventDefault(); index = (index - 1 + groups.length) % groups.length; update(); }
    function onNext(e){ e.preventDefault(); index = (index + 1) % groups.length; update(); }
    if(prev) prev.addEventListener('click', onPrev);
    if(next) next.addEventListener('click', onNext);
    update();
  })();

  // Fullscreen image view on click
  (function(){
    var imgfs = document.getElementById('imgfs');
    if(!imgfs) return;
    var img = imgfs.querySelector('img');
    document.querySelectorAll('.slides img').forEach(function(el){
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function(){
        img.src = el.src;
        imgfs.classList.remove('hidden');
        imgfs.setAttribute('aria-hidden', 'false');
      });
    });
    imgfs.addEventListener('click', function(){
      imgfs.classList.add('hidden');
      imgfs.setAttribute('aria-hidden', 'true');
      img.src = '';
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') { imgfs.classList.add('hidden'); imgfs.setAttribute('aria-hidden', 'true'); img.src=''; } });
  })();
});

