/* Pat Yancovitz galleries. No external libraries or hosted services. */
(function () {
  'use strict';
  function start() {
    document.querySelectorAll('[data-pat-slider]').forEach(function (root) {
      if (root.dataset.ready) return;
      root.dataset.ready = 'true';
      var slides = Array.from(root.querySelectorAll('.pat-slide'));
      var track = root.querySelector('.pat-track');
      var title = root.querySelector('.slider-toolbar [data-title]');
      var count = root.querySelector('[data-count]');
      var index = 0, startX = null;
      function show(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        slides.forEach(function (slide, i) { slide.setAttribute('aria-hidden', String(i !== index)); });
        title.textContent = slides[index].dataset.title;
        count.textContent = (index + 1) + ' / ' + slides.length;
        count.setAttribute('aria-label', 'Image ' + (index + 1) + ' of ' + slides.length);
      }
      root.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
      root.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });
      root.querySelector('.slider-controls').hidden = false;
      root.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
        }
      });
      var surface = root.querySelector('.pat-carousel');
      surface.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].clientX; }, {passive:true});
      surface.addEventListener('touchend', function (event) {
        if (startX !== null) { var delta = event.changedTouches[0].clientX - startX; if (Math.abs(delta) > 55) show(index + (delta < 0 ? 1 : -1)); }
        startX = null;
      }, {passive:true});
      show(0);
    });
    document.querySelectorAll('[data-pat-gallery]').forEach(function (gallery) {
      if (gallery.dataset.ready || !window.HTMLDialogElement) return;
      gallery.dataset.ready = 'true';
      var links = Array.from(gallery.querySelectorAll('[data-pat-open]'));
      var dialog = document.createElement('dialog');
      dialog.className = 'pat-lightbox';
      var uid = 'pat-lightbox-title-' + document.querySelectorAll('.pat-lightbox').length;
      dialog.setAttribute('aria-labelledby', uid);
      dialog.innerHTML = '<div class="lightbox-top"><button type="button" class="lightbox-close" data-close autofocus>Close ×</button></div><div class="lightbox-image"><img alt=""></div><div class="lightbox-bottom"><div aria-live="polite"><h2 class="lightbox-title"></h2><p class="lightbox-description"></p></div><div class="slider-buttons"><button type="button" class="control-button" data-prev>← Previous</button><button type="button" class="control-button" data-next>Next →</button></div></div>';
      dialog.querySelector('h2').id = uid;
      document.body.appendChild(dialog);
      var current = 0, trigger = null, oldOverflow = '', startX = null;
      function show(next) {
        current = (next + links.length) % links.length;
        var source = links[current].querySelector('img');
        var picture = dialog.querySelector('img');
        picture.src = links[current].href;
        picture.alt = source.alt;
        dialog.querySelector('h2').textContent = links[current].dataset.title;
        dialog.querySelector('.lightbox-description').textContent = gallery.dataset.patGallery + ' · Image ' + (current + 1) + ' of ' + links.length;
      }
      links.forEach(function (link, i) {
        link.addEventListener('click', function (event) {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault(); trigger = link; show(i);
          oldOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden'; dialog.showModal();
        });
      });
      dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('close', function () { document.body.style.overflow = oldOverflow; if (trigger) trigger.focus(); });
      dialog.querySelector('[data-prev]').addEventListener('click', function () { show(current - 1); });
      dialog.querySelector('[data-next]').addEventListener('click', function () { show(current + 1); });
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
      });
      var surface = dialog.querySelector('.lightbox-image');
      surface.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].clientX; }, {passive:true});
      surface.addEventListener('touchend', function (event) { if (startX !== null) { var delta = event.changedTouches[0].clientX - startX; if (Math.abs(delta) > 55) show(current + (delta < 0 ? 1 : -1)); } startX = null; }, {passive:true});
    });
    document.querySelectorAll('[data-pat-year]').forEach(function (node) { node.textContent = new Date().getFullYear(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  var pending;
  new MutationObserver(function (changes) {
    if (!changes.some(function (change) { return Array.from(change.addedNodes).some(function (node) { return node.nodeType === 1; }); })) return;
    clearTimeout(pending); pending = setTimeout(start, 100);
  }).observe(document.body, {childList:true, subtree:true});
})();
