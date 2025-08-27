document.addEventListener('DOMContentLoaded', () => {
  // Read URL params:
  // - ?year=YYYY-YYYY&type=performance|olympiad (single)
  // - ?years=2023-2024,2024-2025&type=... (two dashboards)
  const params = new URLSearchParams(window.location.search);
  const selectedYear = params.get('year') || '2024-2025';
  const multiYears = (params.get('years') || '').split(',').filter(Boolean);
  const selectedType = params.get('type') || 'summary';

  const labels = ['Математика','Алгебра','Геометрия','Физика','Информатика','Химия','Биология','География'];

  // Performance data from main page
  const performanceByYear = {
    '2023-2024': [55.93, 50.70, 52.11, 61.84, 68.42, 59.21, 71.92, 77.90],
    '2024-2025': [64.17, 51.97, 57.24, 62.67, 71.56, 60.56, 74.22, 77.95]
  };

  // Olympiad summary (single value per year)
  const olympiadByYear = {
    '2023-2024': 33.33,
    '2024-2025': 40.38
  };

  const title = document.querySelector('.dash-title');
  const typeText = selectedType === 'olympiad' ? 'Олимпиада нәтижелері' : (selectedType === 'summary' ? 'Сводный дашборд' : 'Жалпы білім сапасы');
  const barCtx = document.getElementById('barChart');
  const radarCtx = document.getElementById('radarChart');

  function renderPerformance(ctxBar, ctxRadar, year) {
    const data = performanceByYear[year];
    if (ctxBar) {
      new Chart(ctxBar, { type: 'bar', data: { labels, datasets: [{ label: year, data, backgroundColor: 'rgba(42,128,198,0.7)' }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } } });
    }
    if (ctxRadar) {
      new Chart(ctxRadar, { type: 'radar', data: { labels, datasets: [{ label: year, data, backgroundColor: 'rgba(107,182,232,0.25)', borderColor: 'rgba(107,182,232,1)' }] }, options: { responsive: true, scales: { r: { suggestedMin: 0, suggestedMax: 100, ticks: { callback: v => v + '%' } } } } });
    }
  }

  function renderOlympiad(ctxBar, ctxLine, year) {
    const value = olympiadByYear[year];
    if (ctxBar) {
      new Chart(ctxBar, { type: 'bar', data: { labels: [year], datasets: [{ label: 'Олимпиада %', data: [value], backgroundColor: 'rgba(42,128,198,0.7)' }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } } });
    }
    if (ctxLine) {
      new Chart(ctxLine, { type: 'line', data: { labels: Object.keys(olympiadByYear), datasets: [{ label: 'Жылдар бойынша', data: Object.values(olympiadByYear), borderColor: 'rgba(107,182,232,1)', backgroundColor: 'rgba(107,182,232,0.2)', fill: true }] }, options: { responsive: true, plugins: { tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } } });
    }
  }

  if (selectedType === 'summary') {
    if (title) title.textContent = 'Жалпы білім сапасы (сводный)';
    const summary = document.getElementById('summarySection');
    const detail = document.getElementById('detailSection');
    if (summary) summary.style.display = 'grid';
    if (detail) detail.style.display = 'none';

    const overallData = { '2023-2024': 57.10, '2024-2025': 57.94 };

    const overallCtx = document.getElementById('overallChart');
    const olympiadCtx = document.getElementById('olympiadChart');
    if (overallCtx) {
      new Chart(overallCtx, {
        type: 'bar',
        data: { labels: Object.keys(overallData), datasets: [{ label: 'Успеваемость %', data: Object.values(overallData), backgroundColor: ['rgba(42,128,198,0.7)','rgba(107,182,232,0.7)'] }] },
        options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } }
      });
    }
    // Hide olympiad card on summary view
    if (olympiadCtx && olympiadCtx.parentElement) {
      olympiadCtx.parentElement.style.display = 'none';
    }

  } else if (multiYears.length === 2) {
    if (title) title.textContent = `${typeText} — ${multiYears.join(' & ')}`;
    const secondWrap = document.getElementById('secondYear');
    const detail = document.getElementById('detailSection');
    if (selectedType === 'performance') {
      if (secondWrap) secondWrap.style.display = 'grid';
      renderPerformance(barCtx, radarCtx, multiYears[0]);
      const bar2 = document.getElementById('barChart2');
      const radar2 = document.getElementById('radarChart2');
      renderPerformance(bar2, radar2, multiYears[1]);
    } else {
      // Олимпиада: по одному бар-чарту слева/справа в одной сетке
      if (secondWrap) secondWrap.style.display = 'none';
      if (detail) detail.style.display = 'grid';
      // Используем оба холста detail-секции как два отдельных бар-чарта
      if (barCtx) {
        new Chart(barCtx, { type: 'bar', data: { labels: [multiYears[0]], datasets: [{ label: 'Олимпиада %', data: [olympiadByYear[multiYears[0]]], backgroundColor: 'rgba(42,128,198,0.7)' }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } } });
      }
      if (radarCtx) {
        new Chart(radarCtx, { type: 'bar', data: { labels: [multiYears[1]], datasets: [{ label: 'Олимпиада %', data: [olympiadByYear[multiYears[1]]], backgroundColor: 'rgba(107,182,232,0.7)' }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } } });
      }
    }
  } else {
    if (title) title.textContent = `${typeText} — ${selectedYear}`;
    if (selectedType === 'performance') {
      renderPerformance(barCtx, radarCtx, selectedYear);
    } else {
      renderOlympiad(barCtx, radarCtx, selectedYear);
    }
  }
});
