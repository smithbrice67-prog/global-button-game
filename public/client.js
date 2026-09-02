const socket = io();

const scoreElement = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const statusElement = document.getElementById('status');

socket.on('connect', () => {
  statusElement.textContent = 'ONLINE';
  statusElement.classList.add('online');
});

socket.on('disconnect', () => {
  statusElement.textContent = 'DISCONNECTED';
  statusElement.classList.remove('online');
});

socket.on('score_update', (score) => {
  scoreElement.textContent = Number(score).toLocaleString();
  scoreElement.classList.remove('pop');
  void scoreElement.offsetWidth;
  scoreElement.classList.add('pop');
});

clickButton.addEventListener('click', () => {
  socket.emit('button_clicked');
});
