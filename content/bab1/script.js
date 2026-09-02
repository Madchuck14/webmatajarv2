// ===== SLIDE NAVIGATION =====
const slides = Array.from(document.querySelectorAll('.slide'));
let currentSlide = 0;
const TOTAL = slides.length;

function goToSlide(idx) {
  if (idx < 0 || idx >= TOTAL) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = idx;
  slides[currentSlide].classList.add('active');
  reportProgress();
  updateFsUI();
}

function reportProgress() {
  window.parent.postMessage({ type: 'progress', slide: currentSlide + 1, totalSlide: TOTAL }, '*');
  if (currentSlide === TOTAL - 1) {
    window.parent.postMessage({ type: 'completed' }, '*');
  }
}

// Listen for commands from container
window.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data || !data.type) return;
  if (data.type === 'goToSlide') {
    if (data.slide === 'prev') goToSlide(currentSlide - 1);
    else if (data.slide === 'next') goToSlide(currentSlide + 1);
    else goToSlide(Number(data.slide) - 1);
  }
  if (data.type === 'fullscreenChange') {
    const overlay = document.getElementById('fs-overlay');
    if (overlay) overlay.classList.toggle('active', data.active);
  }
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
});

// Initial report
reportProgress();

// ===== FULLSCREEN OVERLAY =====
(function () {
  const fsLeft = document.getElementById('fs-left');
  const fsRight = document.getElementById('fs-right');

  fsLeft.addEventListener('click', () => goToSlide(currentSlide - 1));
  fsRight.addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('click', (e) => {
    const overlay = document.getElementById('fs-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (e.target.closest('.fs-zone, button, input, label, .drag-item, .quiz-option, .tab-btn, .btn-reveal, .btn-hint, .abs-card, .approach-card, .ball-item')) return;
    const mid = window.innerWidth / 2;
    if (e.clientX > mid) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  });
})();

function updateFsUI() {
  const fill = document.getElementById('fs-progress-fill');
  const counter = document.getElementById('fs-slide-counter');
  if (fill) fill.style.width = `${((currentSlide + 1) / TOTAL) * 100}%`;
  if (counter) counter.textContent = `${currentSlide + 1} / ${TOTAL}`;
}

document.addEventListener('fullscreenchange', updateFsUI);
updateFsUI();


// ===== SLIDE 3: DEKOMPOSISI — reveal steps one by one =====
(function () {
  const btn = document.getElementById('btn-dekomposisi');
  if (!btn) return;
  const items = Array.from(document.querySelectorAll('#dekomposisi-steps .step-item'));
  let revealed = 0;

  btn.addEventListener('click', () => {
    if (revealed < items.length) {
      const item = items[revealed];
      item.classList.remove('hidden');
      revealed++;
      if (revealed === items.length) btn.textContent = '✓ Semua langkah ditampilkan';
    }
  });
})();


// ===== SLIDE 4: CHECKLIST =====
(function () {
  const checks = document.querySelectorAll('.check-item input[type="checkbox"]');
  const result = document.getElementById('check-result');
  if (!checks.length || !result) return;

  function update() {
    const checked = Array.from(checks).filter(c => c.checked).length;
    if (checked === 0) { result.textContent = ''; return; }
    if (checked < checks.length) {
      result.textContent = `${checked} dari ${checks.length} langkah selesai diperiksa...`;
    } else {
      result.textContent = '✅ Semua langkah pemeriksaan selesai! Masalah sudah terdekomposisi.';
    }
  }
  checks.forEach(c => c.addEventListener('change', update));
})();


// ===== SLIDE 5: PENGENALAN POLA =====
(function () {
  const btn = document.getElementById('btn-pola-answer');
  const answer = document.getElementById('pola-answer');
  if (!btn || !answer) return;
  btn.addEventListener('click', () => {
    answer.classList.remove('hidden');
    btn.style.display = 'none';
  });
})();


// ===== SLIDE 6: DERET ANGKA HINTS =====
(function () {
  const hints = [
    { btn: 'btn-hint-1', box: 'hint-1', next: 'btn-hint-2' },
    { btn: 'btn-hint-2', box: 'hint-2', next: 'btn-hint-3' },
    { btn: 'btn-hint-3', box: 'hint-3', next: null },
  ];
  hints.forEach(({ btn, box, next }) => {
    const b = document.getElementById(btn);
    const h = document.getElementById(box);
    if (!b || !h) return;
    b.addEventListener('click', () => {
      h.classList.remove('hidden');
      b.disabled = true;
      if (next) document.getElementById(next).disabled = false;
    });
  });
})();


// ===== SLIDE 7: ABSTRAKSI CARDS =====
(function () {
  document.querySelectorAll('.abs-card').forEach(card => {
    card.addEventListener('click', () => {
      const detail = card.querySelector('.abs-hidden-detail');
      if (detail) detail.classList.toggle('hidden');
    });
  });
})();


// ===== SLIDE 8: DRAG & DROP — urutan membuat teh =====
(function () {
  const list = document.getElementById('drag-list');
  const btn = document.getElementById('btn-check-algo');
  const result = document.getElementById('algo-result');
  if (!list || !btn) return;

  let dragSrc = null;

  list.addEventListener('dragstart', (e) => {
    dragSrc = e.target.closest('.drag-item');
    if (dragSrc) dragSrc.classList.add('dragging');
  });
  list.addEventListener('dragend', () => {
    if (dragSrc) dragSrc.classList.remove('dragging');
    dragSrc = null;
    list.querySelectorAll('.drag-item').forEach(i => i.classList.remove('over'));
  });
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.drag-item');
    if (target && target !== dragSrc) {
      list.querySelectorAll('.drag-item').forEach(i => i.classList.remove('over'));
      target.classList.add('over');
      const rect = target.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY < mid) list.insertBefore(dragSrc, target);
      else list.insertBefore(dragSrc, target.nextSibling);
    }
  });

  btn.addEventListener('click', () => {
    const items = Array.from(list.querySelectorAll('.drag-item'));
    let correct = 0;
    items.forEach((item, idx) => {
      const expected = parseInt(item.dataset.correct);
      if (expected === idx + 1) {
        item.classList.add('correct');
        item.classList.remove('wrong');
        correct++;
      } else {
        item.classList.add('wrong');
        item.classList.remove('correct');
      }
    });
    result.classList.remove('hidden');
    if (correct === items.length) {
      result.style.color = '#1db87a';
      result.textContent = '✅ Urutan benar! Inilah algoritma membuat teh.';
    } else {
      result.style.color = '#e63946';
      result.textContent = `${correct} dari ${items.length} langkah di posisi yang benar. Coba lagi!`;
    }
  });
})();


// ===== SLIDE 9: DISKRIMINAN INTERAKTIF =====
(function () {
  const qaEl = document.getElementById('qa');
  const qbEl = document.getElementById('qb');
  const qcEl = document.getElementById('qc');
  const eqEl = document.getElementById('quad-eq');
  const btn = document.getElementById('btn-solve-quad');
  const out = document.getElementById('quad-result');
  if (!qaEl || !btn) return;

  function updateEq() {
    const a = parseFloat(qaEl.value) || 0;
    const b = parseFloat(qbEl.value) || 0;
    const c = parseFloat(qcEl.value) || 0;
    const bSign = b >= 0 ? '+' : '−';
    const cSign = c >= 0 ? '+' : '−';
    eqEl.textContent = `${a}x² ${bSign} ${Math.abs(b)}x ${cSign} ${Math.abs(c)} = 0`;
  }
  [qaEl, qbEl, qcEl].forEach(el => el.addEventListener('input', updateEq));

  btn.addEventListener('click', () => {
    const a = parseFloat(qaEl.value) || 0;
    const b = parseFloat(qbEl.value) || 0;
    const c = parseFloat(qcEl.value) || 0;

    const D = b * b - 4 * a * c;
    let html = `<strong>Langkah algoritma:</strong><br>`;
    html += `1. a = ${a}, b = ${b}, c = ${c}<br>`;
    html += `2. Hitung diskriminan: D = ${b}² − 4(${a})(${c}) = <strong>${D}</strong><br>`;

    if (D > 0) {
      const x1 = ((-b + Math.sqrt(D)) / (2 * a)).toFixed(3);
      const x2 = ((-b - Math.sqrt(D)) / (2 * a)).toFixed(3);
      html += `3. D > 0 → Dua akar riil berbeda<br>`;
      html += `4. x₁ = ${x1}, x₂ = ${x2}`;
    } else if (D === 0) {
      const x = (-b / (2 * a)).toFixed(3);
      html += `3. D = 0 → Satu akar riil kembar<br>`;
      html += `4. x = ${x}`;
    } else {
      html += `3. D < 0 → Dua akar kompleks (tidak real)`;
    }

    out.innerHTML = html;
    out.classList.remove('hidden');
  });
})();


// ===== SLIDE 10: PSEUDOCODE RUN =====
(function () {
  const btn = document.getElementById('btn-pseudo-run');
  const pEl = document.getElementById('pseudo-p');
  const lEl = document.getElementById('pseudo-l');
  const out = document.getElementById('pseudo-output');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const p = parseFloat(pEl.value) || 0;
    const l = parseFloat(lEl.value) || 0;
    const L = p * l;
    out.innerHTML = `MASUKKAN p = ${p}, l = ${l}<br>HITUNG L = ${p} × ${l}<br>TAMPILKAN L = <strong>${L}</strong>`;
    out.classList.remove('hidden');
  });
})();


// ===== SLIDE 13: TABS =====
(function () {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const content = document.getElementById('tab-' + tab);
      if (content) content.classList.add('active');
    });
  });
})();


// ===== SLIDE 14: KUIS =====
(function () {
  const questions = [
    {
      q: 'Teknik memecah masalah kompleks menjadi bagian-bagian yang lebih sederhana disebut...',
      options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Berpikir Algoritma'],
      correct: 1,
      explanation: 'Dekomposisi berasal dari prinsip "divide et impera" — memecah masalah besar menjadi sub-masalah yang lebih mudah diselesaikan.'
    },
    {
      q: 'Dalam deret 3, 4, 5, 9, 7, 16, 9, 25, 11, 36, ... suku ke-11 adalah...',
      options: ['12', '13', '14', '15'],
      correct: 1,
      explanation: 'Posisi ganjil: 3, 5, 7, 9, 11, 13 (+2). Jadi suku ke-11 adalah 13.'
    },
    {
      q: 'Flowchart menggunakan bentuk apa untuk menggambarkan percabangan logika?',
      options: ['Persegi panjang', 'Oval / rounded', 'Belah ketupat (diamond)', 'Jajar genjang'],
      correct: 2,
      explanation: 'Belah ketupat (diamond) digunakan untuk Decision — menentukan cabang "Ya" atau "Tidak".'
    },
    {
      q: 'Penerapan elemen-elemen permainan dalam konteks non-permainan untuk meningkatkan motivasi disebut...',
      options: ['Algoritma', 'Pseudocode', 'Gamifikasi', 'Abstraksi'],
      correct: 2,
      explanation: 'Gamifikasi menggunakan elemen seperti poin, badge, dan level untuk meningkatkan keterlibatan dan motivasi.'
    }
  ];

  let qIdx = 0;
  let score = 0;
  const container = document.getElementById('quiz-container');
  const final = document.getElementById('quiz-final');
  const qCurrent = document.getElementById('q-current');
  const qTotal = document.getElementById('q-total');
  const qQuestion = document.getElementById('quiz-question');
  const qOptions = document.getElementById('quiz-options');
  const qFeedback = document.getElementById('quiz-feedback');
  const btnNext = document.getElementById('btn-next-q');
  const btnRetry = document.getElementById('btn-retry');
  const finalScore = document.getElementById('final-score');

  if (!container) return;

  qTotal.textContent = questions.length;

  function renderQuestion() {
    const q = questions[qIdx];
    qCurrent.textContent = qIdx + 1;
    qQuestion.textContent = q.q;
    qOptions.innerHTML = '';
    qFeedback.className = 'quiz-feedback hidden';
    btnNext.classList.add('hidden');

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => answer(i));
      qOptions.appendChild(btn);
    });
  }

  function answer(idx) {
    const q = questions[qIdx];
    const buttons = qOptions.querySelectorAll('.quiz-option');
    buttons.forEach(b => b.disabled = true);
    buttons[q.correct].classList.add('correct');

    if (idx === q.correct) {
      score++;
      qFeedback.className = 'quiz-feedback correct';
      qFeedback.textContent = '✅ Benar! ' + q.explanation;
    } else {
      buttons[idx].classList.add('wrong');
      qFeedback.className = 'quiz-feedback wrong';
      qFeedback.textContent = '❌ Kurang tepat. ' + q.explanation;
    }

    btnNext.classList.remove('hidden');
    btnNext.textContent = qIdx < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil';
  }

  btnNext.addEventListener('click', () => {
    qIdx++;
    if (qIdx < questions.length) {
      renderQuestion();
    } else {
      container.style.display = 'none';
      final.classList.remove('hidden');
      finalScore.textContent = `Skor kamu: ${score} / ${questions.length} 🎯`;
    }
  });

  btnRetry.addEventListener('click', () => {
    qIdx = 0; score = 0;
    container.style.display = '';
    final.classList.add('hidden');
    renderQuestion();
  });

  renderQuestion();
})();
