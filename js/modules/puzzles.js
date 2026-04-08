const PUZZLES = [
  {
    id: 'memory',
    title: 'Memory Match',
    desc: 'Flip cards to find matching pairs',
    color: '#2c5f7a',
    play: playMemory
  },
  {
    id: 'wordscram',
    title: 'Word Scramble',
    desc: 'Unscramble the hidden word',
    color: '#4a7c59',
    play: playWordScramble
  },
  {
    id: 'trivia',
    title: 'Daily Trivia',
    desc: 'Answer 5 fun trivia questions',
    color: '#c07830',
    play: playTrivia
  },
  {
    id: 'sequence',
    title: 'Number Sequence',
    desc: 'What comes next in the pattern?',
    color: '#2a8a8a',
    play: playSequence
  }
];

const WORD_LIST = [
  'GARDEN','SIMPLE','FLOWER','SUNSET','MEMORY','BRIDGE','PUZZLE','CANDLE','BUTTER','SILVER',
  'ANCHOR','BREEZE','CIRCLE','CASTLE','DANCER','GENTLE','HARBOR','ISLAND','JOYFUL','KITTEN'
];

const TRIVIA_QUESTIONS = [
  { q: 'What is the largest planet in our solar system?', a: ['Jupiter','Saturn','Mars','Neptune'], correct: 0 },
  { q: 'How many colors are in a rainbow?', a: ['5','6','7','8'], correct: 2 },
  { q: 'What do bees make?', a: ['Silk','Honey','Wax only','Nectar only'], correct: 1 },
  { q: 'Which season comes after winter?', a: ['Fall','Summer','Spring','Monsoon'], correct: 2 },
  { q: 'How many days are in a week?', a: ['5','6','7','8'], correct: 2 },
  { q: 'What color is the sky on a clear day?', a: ['Green','Blue','Yellow','Gray'], correct: 1 },
  { q: 'Which animal is known as man\'s best friend?', a: ['Cat','Dog','Horse','Bird'], correct: 1 },
  { q: 'How many months are in a year?', a: ['10','11','12','13'], correct: 2 },
  { q: 'What do you use to write on paper?', a: ['Spoon','Pencil','Fork','Cup'], correct: 1 },
  { q: 'Which fruit is yellow and curved?', a: ['Apple','Orange','Banana','Grape'], correct: 2 },
];

function render_puzzles() {
  showPuzzleMenu();
}

function showPuzzleMenu() {
  const log = Storage.getArray('ng_puzzle_log');
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = log.filter(l => l.date === today);

  let html = `
    <div style="background:#e3f2fd;border:1px solid #90caf9;border-radius:12px;padding:14px 20px;margin:12px 20px;font-size:15px;color:#1a5276">
      🧠 Brain exercises help keep your mind sharp. Try one each day!
    </div>`;

  PUZZLES.forEach(p => {
    const played = todayLog.find(l => l.puzzleId === p.id);
    html += `
      <div class="card" style="margin:10px 20px;border-left:5px solid ${p.color}">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700">${p.title}</div>
            <div style="color:var(--text-muted);font-size:15px;margin-top:2px">${p.desc}</div>
            ${played ? `<div style="color:#2e6b3e;font-weight:700;font-size:14px;margin-top:6px">✅ Completed today — Score: ${played.score}</div>` : ''}
          </div>
          <button class="btn btn-primary" style="flex-shrink:0;min-width:90px" onclick="startPuzzle('${p.id}')">${played ? 'Play Again' : 'Play'}</button>
        </div>
      </div>`;
  });

  document.getElementById('puzzles-content').innerHTML = html;
}

function startPuzzle(id) {
  const p = PUZZLES.find(x => x.id === id);
  if (p) p.play();
}

function logPuzzleScore(puzzleId, score) {
  Storage.push('ng_puzzle_log', {
    id: Storage.uid(),
    puzzleId,
    score,
    date: new Date().toISOString().slice(0, 10),
    timestamp: Date.now()
  });
}

function puzzleBackBtn() {
  return `<button class="btn btn-ghost" style="margin:12px 20px" onclick="showPuzzleMenu()">← Back to Puzzles</button>`;
}

/* ── MEMORY MATCH ── */
function playMemory() {
  const emojis = ['🌸','🎵','🌟','🍎','🦋','🌈','🎨','🐦'];
  let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
  let selected = [];
  let moves = 0;

  function render() {
    const matched = cards.filter(c => c.matched).length / 2;
    document.getElementById('puzzles-content').innerHTML = `
      ${puzzleBackBtn()}
      <div style="padding:0 20px;text-align:center">
        <h2 style="font-size:22px;color:var(--primary)">Memory Match</h2>
        <div style="color:var(--text-muted);font-size:16px;margin-bottom:16px">Pairs found: ${matched}/8 · Moves: ${moves}</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:360px;margin:0 auto">
          ${cards.map(c => `
            <button onclick="memoryFlip(${c.id})"
              style="height:80px;font-size:36px;border-radius:12px;border:2px solid var(--border);background:${c.flipped || c.matched ? 'var(--surface)' : 'var(--primary)'};cursor:${c.matched ? 'default' : 'pointer'};transition:all 0.2s"
              ${c.matched ? 'disabled' : ''}
              aria-label="${c.flipped || c.matched ? c.emoji : 'Hidden card'}">
              ${c.flipped || c.matched ? c.emoji : ''}
            </button>`).join('')}
        </div>
      </div>`;
  }

  window.memoryFlip = (id) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched || selected.length === 2) return;
    card.flipped = true;
    selected.push(card);
    render();
    if (selected.length === 2) {
      moves++;
      if (selected[0].emoji === selected[1].emoji) {
        selected.forEach(c => c.matched = true);
        selected = [];
        render();
        if (cards.every(c => c.matched)) {
          const score = Math.max(10, 100 - moves * 3);
          logPuzzleScore('memory', score);
          setTimeout(() => {
            document.getElementById('puzzles-content').innerHTML = `
              ${puzzleBackBtn()}
              <div class="card" style="margin:20px;text-align:center">
                <div style="font-size:60px">🎉</div>
                <h2 style="font-size:24px;color:var(--primary)">Well done!</h2>
                <p style="font-size:18px">You matched all pairs in ${moves} moves!</p>
                <p style="font-size:20px;font-weight:700;color:var(--secondary)">Score: ${score}</p>
              </div>`;
          }, 400);
        }
      } else {
        setTimeout(() => {
          selected.forEach(c => c.flipped = false);
          selected = [];
          render();
        }, 1000);
      }
    }
  };
  render();
}

/* ── WORD SCRAMBLE ── */
function playWordScramble() {
  const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
  let attempts = 0;

  function render(feedback) {
    document.getElementById('puzzles-content').innerHTML = `
      ${puzzleBackBtn()}
      <div class="card" style="margin:20px;text-align:center">
        <h2 style="font-size:22px;color:var(--primary);margin-bottom:8px">Word Scramble</h2>
        <p style="color:var(--text-muted);font-size:16px;margin-bottom:20px">Unscramble this word:</p>
        <div style="font-size:42px;font-weight:800;letter-spacing:10px;color:var(--primary);margin-bottom:24px">${scrambled}</div>
        ${feedback ? `<div style="font-size:18px;color:#c62828;margin-bottom:12px">${feedback}</div>` : ''}
        <input id="scram-input" type="text" placeholder="Your answer" style="font-size:24px;text-align:center;text-transform:uppercase;letter-spacing:4px;max-width:300px"
          oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')checkScramble('${word}')">
        <button class="btn btn-primary" style="width:100%;max-width:300px;font-size:20px;margin-top:12px" onclick="checkScramble('${word}')">Check Answer</button>
        <button class="btn btn-ghost" style="width:100%;max-width:300px;margin-top:8px" onclick="playWordScramble()">New Word</button>
      </div>`;
    document.getElementById('scram-input')?.focus();
  }

  window.checkScramble = (answer) => {
    const guess = document.getElementById('scram-input').value.trim().toUpperCase();
    attempts++;
    if (guess === answer) {
      const score = Math.max(10, 100 - (attempts - 1) * 20);
      logPuzzleScore('wordscram', score);
      document.getElementById('puzzles-content').innerHTML = `
        ${puzzleBackBtn()}
        <div class="card" style="margin:20px;text-align:center">
          <div style="font-size:60px">🎉</div>
          <h2 style="font-size:24px;color:var(--primary)">Correct!</h2>
          <p style="font-size:22px;font-weight:700">The word was: ${answer}</p>
          <p style="font-size:20px;font-weight:700;color:var(--secondary)">Score: ${score}</p>
          <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="playWordScramble()">Play Again</button>
        </div>`;
    } else {
      const hint = attempts >= 3 ? `Hint: starts with "${answer[0]}"` : attempts >= 2 ? 'Try again!' : 'Not quite — try again!';
      render(hint);
    }
  };
  render();
}

/* ── TRIVIA ── */
function playTrivia() {
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  let current = 0;
  let score = 0;

  function renderQ() {
    const q = shuffled[current];
    document.getElementById('puzzles-content').innerHTML = `
      ${puzzleBackBtn()}
      <div class="card" style="margin:20px">
        <div style="color:var(--text-muted);font-size:15px;margin-bottom:8px">Question ${current + 1} of 5</div>
        <div style="font-size:21px;font-weight:700;margin-bottom:24px;line-height:1.4">${q.q}</div>
        ${q.a.map((ans, i) => `
          <button onclick="answerTrivia(${i})"
            style="width:100%;text-align:left;padding:18px 20px;font-size:18px;font-weight:600;border-radius:12px;border:2px solid var(--border);background:var(--surface);margin-bottom:10px;cursor:pointer;color:var(--text)"
            aria-label="${ans}">${ans}</button>`).join('')}
      </div>`;
  }

  window.answerTrivia = (chosen) => {
    const q = shuffled[current];
    const correct = chosen === q.correct;
    if (correct) score++;
    const bg = correct ? '#e8f5e9' : '#fdecea';
    const msg = correct ? '✅ Correct!' : `❌ The answer was: ${q.a[q.correct]}`;
    document.getElementById('puzzles-content').innerHTML = `
      ${puzzleBackBtn()}
      <div class="card" style="margin:20px;background:${bg}">
        <div style="font-size:20px;font-weight:700;margin-bottom:8px">${msg}</div>
        <div style="color:var(--text-muted);margin-bottom:20px">${q.q}</div>
        <button class="btn btn-primary" style="width:100%;font-size:18px" onclick="triviaNext()">
          ${current + 1 < 5 ? 'Next Question →' : 'See Results'}
        </button>
      </div>`;
  };

  window.triviaNext = () => {
    current++;
    if (current < 5) { renderQ(); }
    else {
      logPuzzleScore('trivia', score * 20);
      document.getElementById('puzzles-content').innerHTML = `
        ${puzzleBackBtn()}
        <div class="card" style="margin:20px;text-align:center">
          <div style="font-size:60px">${score >= 4 ? '🏆' : score >= 2 ? '👏' : '💪'}</div>
          <h2 style="font-size:24px;color:var(--primary)">Quiz Complete!</h2>
          <p style="font-size:22px;font-weight:700">You got ${score} out of 5 correct</p>
          <p style="font-size:20px;font-weight:700;color:var(--secondary)">Score: ${score * 20}</p>
          <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="playTrivia()">Play Again</button>
        </div>`;
    }
  };
  renderQ();
}

/* ── NUMBER SEQUENCE ── */
function playSequence() {
  const patterns = [
    { seq: [2,4,6,8,10], ans: 12, hint: 'Add 2 each time' },
    { seq: [1,3,6,10,15], ans: 21, hint: 'Add 2, then 3, then 4...' },
    { seq: [100,90,80,70,60], ans: 50, hint: 'Subtract 10 each time' },
    { seq: [1,2,4,8,16], ans: 32, hint: 'Double each time' },
    { seq: [5,10,15,20,25], ans: 30, hint: 'Add 5 each time' },
    { seq: [3,6,9,12,15], ans: 18, hint: 'Add 3 each time' },
    { seq: [50,45,40,35,30], ans: 25, hint: 'Subtract 5 each time' },
    { seq: [1,4,9,16,25], ans: 36, hint: 'Square numbers: 1², 2², 3²...' },
  ];
  const p = patterns[Math.floor(Math.random() * patterns.length)];
  let attempts = 0;

  function render(feedback) {
    document.getElementById('puzzles-content').innerHTML = `
      ${puzzleBackBtn()}
      <div class="card" style="margin:20px;text-align:center">
        <h2 style="font-size:22px;color:var(--primary);margin-bottom:8px">Number Sequence</h2>
        <p style="color:var(--text-muted);font-size:16px;margin-bottom:20px">What number comes next?</p>
        <div style="font-size:36px;font-weight:800;color:var(--primary);letter-spacing:8px;margin-bottom:24px">
          ${p.seq.join('  ·  ')}  ·  <span style="color:var(--border)">?</span>
        </div>
        ${feedback ? `<div style="font-size:18px;color:#c62828;margin-bottom:12px">${feedback}</div>` : ''}
        ${attempts >= 2 ? `<div style="font-size:16px;color:var(--text-muted);margin-bottom:12px">Hint: ${p.hint}</div>` : ''}
        <input id="seq-input" type="number" placeholder="Your answer" style="font-size:28px;text-align:center;max-width:200px"
          onkeydown="if(event.key==='Enter')checkSequence(${p.ans})">
        <button class="btn btn-primary" style="width:100%;max-width:280px;font-size:20px;margin-top:12px" onclick="checkSequence(${p.ans})">Check</button>
      </div>`;
    document.getElementById('seq-input')?.focus();
  }

  window.checkSequence = (answer) => {
    const guess = parseInt(document.getElementById('seq-input').value, 10);
    attempts++;
    if (guess === answer) {
      const score = Math.max(10, 100 - (attempts - 1) * 30);
      logPuzzleScore('sequence', score);
      document.getElementById('puzzles-content').innerHTML = `
        ${puzzleBackBtn()}
        <div class="card" style="margin:20px;text-align:center">
          <div style="font-size:60px">🎉</div>
          <h2 style="font-size:24px;color:var(--primary)">Correct!</h2>
          <p style="font-size:20px">The answer was <strong>${answer}</strong></p>
          <p style="font-size:16px;color:var(--text-muted)">${p.hint}</p>
          <p style="font-size:20px;font-weight:700;color:var(--secondary)">Score: ${score}</p>
          <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="playSequence()">Play Again</button>
        </div>`;
    } else {
      render(attempts >= 2 ? 'Still not right — check the hint!' : 'Not quite, try again!');
    }
  };
  render();
}
