const history = [];
const agents = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  correct: 0,
  lastPrediction: null,
}));

function predict(agent, hist) {
  if (hist.length === 0) return Math.random() > 0.5 ? 'B' : 'P';

  switch (agent.id) {
    case 1:
      return hist[hist.length - 1]; // 마지막과 동일
    case 2:
      return hist[hist.length - 1] === 'B' ? 'P' : 'B'; // 반대로
    case 3:
      return hist.slice(-3).filter(v => v === 'B').length >= 2 ? 'B' : 'P';
    case 4:
      return hist.length % 2 === 0 ? 'B' : 'P';
    case 5:
      return Math.random() < 0.6 ? 'B' : 'P';
    case 6:
      return Math.random() < 0.6 ? 'P' : 'B';
    case 7:
      return hist.slice(-2).every(v => v === 'B') ? 'P' : 'B';
    case 8:
      return hist.length >= 3 && hist[hist.length - 3] === hist[hist.length - 2] ? 'P' : 'B';
    case 9:
      return hist.filter(x => x === 'B').length > hist.filter(x => x === 'P').length ? 'P' : 'B';
    case 10:
      return Math.random() > 0.5 ? 'B' : 'P';
    default:
      return 'B';
  }
}

function updateAgents(realResult) {
  agents.forEach(agent => {
    if (agent.lastPrediction === realResult) agent.correct++;
  });
}

function updateAgentPredictions() {
  const statEl = document.getElementById("agentStats");
  statEl.innerHTML = "";

  let top = agents[0];
  agents.forEach(agent => {
    agent.lastPrediction = predict(agent, history);
    if (agent.correct > top.correct) top = agent;

    const li = document.createElement("li");
    li.textContent = `에이전트 ${agent.id}: 예측 ${agent.lastPrediction}, 정답 수 ${agent.correct}`;
    statEl.appendChild(li);
  });

  const bestEl = document.getElementById("bestPrediction");
  bestEl.textContent = top.lastPrediction === 'B' ? '🔴 뱅커' : '🔵 플레이어';
}

function updateHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  history.slice(-10).forEach((res, i) => {
    const li = document.createElement("li");
    li.textContent = `${history.length - 10 + i + 1}. ` +
      (res === 'B' ? '🔴 뱅커' : res === 'P' ? '🔵 플레이어' : '🟢 타이');
    historyList.appendChild(li);
  });
}

document.querySelectorAll('.circle').forEach(btn => {
  btn.addEventListener('click', () => {
    const result = btn.getAttribute("data-result");
    updateAgents(result);
    history.push(result);
    updateHistory();
    updateAgentPredictions();
  });
});

document.getElementById("calcBtn").addEventListener("click", () => {
  const base = Number(document.getElementById("baseBet").value);
  const step = Number(document.getElementById("currentStep").value);
  const nextBet = base * 2 ** step;
  const totalLoss = Array.from({ length: step }).reduce((sum, _, i) => sum + base * 2 ** i, 0);
  document.getElementById("nextBet").textContent = `${nextBet.toLocaleString()} 원`;
  document.getElementById("totalLoss").textContent = `${totalLoss.toLocaleString()} 원`;
});