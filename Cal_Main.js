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
        <div>
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

    // Create a link element for the CSS file
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://sungjun1004.github.io/SAC/styles.css'); // Ensure the path is correct
    
    // Append the link to the shadow DOM
    this._shadowRoot.appendChild(link);
      
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      const date = new Date('2024-09-10');
      makeCalendar.call(this, date); 
    }

   onCustomWidgetResize (width, height) {
      this.render()
    }

    onCustomWidgetAfterUpdate (changedProps) {
    }

    onCustomWidgetDestroy () {
    }

    render () {
    }
    
  }

  customElements.define('com-sapkorea-sac-sungjun-cal01', Main);
})();
