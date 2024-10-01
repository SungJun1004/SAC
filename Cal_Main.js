(function () {

  // 임시 데이터
  const data = [
    { date: '2024-09-03', content: '테스트1' },
    { date: '2024-09-08', content: '테스트2' },
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
  // pad method 숫자 2자리로 통일
  Number.prototype.pad = function() {
    return this > 9 ? this : '0' + this;
  }

    const makeCalendar = function(date) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    const firstDay = new Date(date.setDate(1)).getDay();
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();

    const limitDay = firstDay + lastDay;
    const nextDay = Math.ceil(limitDay / 7) * 7;

    let htmlDummy = '';

    //전월 처리
    for (let i = 0; i < firstDay; i++) {
      htmlDummy += `<div class="noColor"></div>`;
    }
   
    // 당월처리
    for (let i = 1; i <= lastDay; i++) {
      const dateStr = `${currentYear}-${currentMonth.pad()}-${i.pad()}`;
      htmlDummy += `
        <div class="currentColor">
          ${i}
           <br><br><br><br>
           <p>${calendarList[dateStr]?.join('</p><p>') || ''}</p>
         
        </div>
      `;
    }
  
    //  이후 처리
    for (let i = limitDay; i < nextDay; i++) {
      htmlDummy += `<div class="noColor"></div>`;
    }

    this._dateBoard = this._shadowRoot.querySelector('.dateBoard');
    this._dateBoard.innerHTML = htmlDummy;
    
  };

  const template = document.createElement('template');
   // CSS 파일을 불러오기
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://sungjun1004.github.io/SAC/styles.css'; // CSS 파일의 URL
  this._shadowRoot.appendChild(link);
  
  template.innerHTML = `
  <div class='rap'>
    <div class="header">
      <div id="dateTitle"></div>
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
  `;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.date = new Date(this.getAttribute('date') || '2024-09-10');
      this.render();
    }

    static get observedAttributes() {
      return ['date'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'date') {
        this.date = new Date(newValue);
        this.render();
      }
    }
    render() {
      const dateTitle = this._shadowRoot.getElementById('dateTitle');
      dateTitle.textContent = `${this.date.getFullYear()}-${(this.date.getMonth() + 1).pad()}`;
      makeCalendar.call(this, this.date);
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    onCustomWidgetAfterUpdate(changedProps) {
      // 변경된 속성에 따라 추가 로직
    }

    onCustomWidgetDestroy() {
      // 정리 로직
    }
  }
  customElements.define('com-sapkorea-sac-sungjun-cal01', Main);
})();
