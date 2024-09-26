
(function () {
 
// 임시 데이터
const data = [
  { date: '2024-09-15', content: '테스트1' },
  { date: '2024-09-03', content: '테스트2' },
  { date: '2024-09-15', content: '테스트3' },
  { date: '2024-09-26', content: '테스트4' },
  { date: '2024-09-21', content: '테스트5' },
];

// 데이터 가공
const calendarList = data.reduce(
  (acc, v) => 
    ({ ...acc, [v.date]: [...(acc[v.date] || []), v.content] })
  , {}
);

// pad method
Number.prototype.pad = function() {
  return this > 9 ? this : '0' + this;
}

const makeCalendar = (date) => {
  const currentYear = new Date(date).getFullYear();
  const currentMonth = new Date(date).getMonth() + 1;

  const firstDay = new Date(date.setDate(1)).getDay();
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();

  const limitDay = firstDay + lastDay;
  const nextDay = Math.ceil(limitDay / 7) * 7;

  let htmlDummy = '';

  for (let i = 0; i < firstDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    const date = `${currentYear}-${currentMonth.pad()}-${i.pad()}`
    
    htmlDummy += `
      <div>
        ${i}
        <p>
          ${calendarList[date]?.join('</p><p>') || ''}
        </p>
      </div>
    `;
  }

  for (let i = limitDay; i < nextDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }
  
  document.querySelector(`.dateBoard`).innerHTML = htmlDummy;
  document.querySelector(`.dateTitle`).innerText = `${currentYear}년 ${currentMonth}월`;
}

  const template = document.createElement('template')
  template.innerHTML = `
<style>
.rap {
  max-width: 1280x;
  padding: 0 1.4rem;
  margin-top: .3rem;
}

.dateHead {
  margin-bottom: .4rem;
}

.dateHead div {
  background: #e31b20;
  color: #fff;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
}

.grid div {
  padding: .6rem;
  font-size: .9rem;
  cursor: pointer;
}

.dateBoard div {
  color: #222;
  font-weight: bold;
  min-height: 6rem;
  padding: .6rem .8rem;
  border-radius: .6rem;
  border: 1px solid #eee;
}

.noColor {
  background: #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.btn {
 display: block;
 width: 20px;
 height: 20px;
 border: 3px solid #000;
 border-width: 3px 3px 0 0;
 cursor: pointer;
}

.prevDay {
  transform: rotate(-135deg);
}

.nextDay {
  transform: rotate(45deg);
}

.dateBoard div p {
  font-weight: normal;
  margin-top: .2rem;
}

/* ------------- */

@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;  
  font-family: Pretendard;
}
</style>

   <div class='rap'>
    <div class="header">
       <div class="btn prevDay"></div>
      <h2 class='dateTitle'></h2>
      <div class="btn nextDay"></div>
    </div>
    
    <div class="grid dateHead">
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>

    <div class="grid dateBoard"></div>
  </div>
      `
  class Main extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')
     const date = new Date('2024-09-10');
     makeCalendar(date); 
   
    }
  }

  customElements.define('com-sapkorea-sac-sungjun-cal01', Main)
})()

