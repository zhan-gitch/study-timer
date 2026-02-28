// 学习计时器脚本（精简、修复重复与缺失）
// 定义时间变量和计时器
let hour = 0, minute = 0, second = 0;
let timer = null;

// 获取页面元素（script 在 body 末尾引入，可直接获取）
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const saveBtn = document.getElementById('save');

// 每秒更新时间
function updateTime() {
  second++;
  if (second >= 60) {
    second = 0;
    minute++;
  }
  if (minute >= 60) {
    minute = 0;
    hour++;
  }
  timeDisplay.innerText =
    String(hour).padStart(2, '0') + ':' +
    String(minute).padStart(2, '0') + ':' +
    String(second).padStart(2, '0');
}

// 计时器控制
function startTimer() {
  if (!timer) timer = setInterval(updateTime, 1000);
}
function pauseTimer() {
  clearInterval(timer);
  timer = null;
}
function resetTimer() {
  clearInterval(timer);
  timer = null;
  hour = minute = second = 0;
  timeDisplay.innerText = '00:00:00';
}

// 保存记录到 localStorage
function saveRecord() {
  const subject = document.getElementById('subjectSelect')?.value || '未命名';
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  if (hour === 0 && minute === 0 && second === 0) {
    alert('请先计时！');
    return;
  }
  const records = JSON.parse(localStorage.getItem('studyRecords')) || [];
  records.push({ subject, time: timeStr, date: new Date().toLocaleString('zh-CN') });
  localStorage.setItem('studyRecords', JSON.stringify(records));
  displayRecords();
  resetTimer();
  alert('已保存');
}

// 渲染记录
function displayRecords() {
  const recordList = document.getElementById('recordList');
  if (!recordList) return;
  const records = JSON.parse(localStorage.getItem('studyRecords')) || [];
  recordList.innerHTML = '';
  records.forEach((record, index) => {
    const li = document.createElement('li');
    li.textContent = `${record.subject} - ${record.time} (${record.date}) `;
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.onclick = () => deleteRecord(index);
    li.appendChild(delBtn);
    recordList.appendChild(li);
  });
}

function deleteRecord(index) {
  const records = JSON.parse(localStorage.getItem('studyRecords')) || [];
  records.splice(index, 1);
  localStorage.setItem('studyRecords', JSON.stringify(records));
  displayRecords();
}

// 绑定事件并初始化
startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;
saveBtn.onclick = saveRecord;

// 页面加载时显示记录
displayRecords();
