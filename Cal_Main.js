(function () {
  // 임시 데이터
  const data = [
    { date: '2024-09-03', content: '테스트1' },
    { date: '2024-09-08', content: '테스트2' },
    { date: '2024-09-15', content: '테스트3' },
    { date: '2024-09-26', content: '테스트4' },
    { date: '2024-09-21', content: '테스트5' },
  ];

  // 데이터 가공 함수
  const processData = (data) => {
    return data.reduce((acc, v) => {
      acc[v.date] = [...(acc[v.date] || []), v.content];
      return acc;
    }, {});
  };

  // pad 메소드
  const pad = (num) => (num > 9 ? num : '0' + num);

  // 캘린더 생성 함수
  const makeCalendar = function (date) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    const firstDay = new Date(date.setDate(1)).getDay();
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const limitDay = firstDay + lastDay;
    const nextDay = Math.ceil(limitDay / 7) * 7;

    let htmlDummy = '';

    // 전월 처리
    for (let i = 0; i < firstDay; i++) {
      htmlDummy += `<div class="noColor"></div>`;
    }

    // 당월 처리
    const calendarList = processData(data);
    for (let i = 1; i <= lastDay; i++) {
      const dateStr = `${currentYear}-${pad(currentMonth)}-${pad(i)}`;
      htmlDummy += `
        <div class="currentColor">
          ${i}
          <br><br><br><br>
          <p>${calendarList[dateStr]?.join('</p><p>') || ''}</p>
        </div>
      `;
    }

    // 이후 처리
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
  `
class Main extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });

    // CSS 파일 로드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://sungjun1004.github.io/SAC/style.css';
    this._shadowRoot.appendChild(link);

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
    try {
      makeCalendar.call(this, this.date);
    } catch (error) {
      console.error("캘린더 렌더링 중 오류 발생:", error);
    }
  }

  onCustomWidgetResize(width, height) {
    // 위젯의 크기를 새로 할당
    this._shadowRoot.querySelector('.rap').style.width = `${width}px`;
    this._shadowRoot.querySelector('.rap').style.height = `${height}px`;

    this.render(); // 크기 변경 후 다시 렌더링
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
