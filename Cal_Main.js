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
