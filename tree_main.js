const getScriptPromisify = (src) => {
    return new Promise((resolve) => {
        $.getScript(src, resolve);
    });
};

// 바인딩된 데이터를 트리구조에 맞추어 파싱 처리 
const parseMetadata = (data) => {
const dimensionsMap = {};
const dimensions = [];

data.forEach(item => {
const dimension = item.dimensions_0;

if (dimension) {
    const { id, label, parentId } = dimension;
    const dimObj = { id, label, parentId };

    dimensionsMap[id] = dimObj;

    if (!parentId) {
        dimensions.push(dimObj);
    }
}
});

dimensions.forEach(dim => {
    dim.children = Object.values(dimensionsMap).filter(child => child.parentId === dim.id);
});

return { dimensions };
};

(function () {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
        ul {
            list-style-type: none;
            padding-left: 20px;
            margin: 0; /* 기본 margin 제거 */
            font-size: 12px; /* 원하는 폰트 사이즈로 조정 */
            }
        .hidden {
            display: none;
        }
        .toggle-button {
            cursor: pointer;
            margin-right: 5px;
        }
       #treeContainer {
            max-height: 410px; /* 최대 높이 조정 */
            overflow-y: auto;  /* 수직 스크롤 활성화 */
            overflow-x: hidden; /* 수평 스크롤 비활성화 */
            padding-bottom: 10px; /* 하단 패딩 추가 */
            box-sizing: border-box; /* 패딩이 전체 높이에 포함되도록 설정 */
        }
        
    </style>
    <div id="root" style="width: 100%; height: 100%;">
        <div id="treeContainer"></div>
    </div>
`;

class Main extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._treeContainer = this._shadowRoot.getElementById('treeContainer');
        this.selectedItems = []; // 선택된 체크박스를 추적하기 위한 배열
               
    }
    onInitialization() {
            this.height = this.clientHeight;
        console.log(`Root height: ${this.clientHeight}px`);
        }
    
    onCustomWidgetResize(width, height) {
        this.height = height; // height를 설정
        console.log(`Resize event triggered: width=${width}, height=${height}`);
        
        this.render();
       // this.adjustTreeContainerHeight();
    }

    onCustomWidgetAfterUpdate(changedProps) {
     
        this.render();
    }

    onCustomWidgetDestroy() {
        // 필요 시 정리 작업 수행
    }

    async render() {
        const dataBinding = this.dataBinding;

        // 데이터 바인딩 성공인 경우만 실행
        if (!dataBinding || dataBinding.state !== 'success') {
            return;
        }

        const { data } = dataBinding;
        const { dimensions } = parseMetadata(data);

        this._treeContainer.innerHTML = '';
        const ul = this._generateTree(dimensions);
        this._treeContainer.appendChild(ul);
        
     
        // 트리 컨테이너의 최대 높이를 설정
        const maxheight1 = (this.height && !isNaN(this.height)) ? this.height - 10 : 200; // 기본값 설정
        this._treeContainer.style.maxHeight = `${maxheight1}px`;
    
        console.log(`this.height: ${this.height}`);
        console.log(`maxHeight1: ${maxheight1}`);
    }
  
 _generateTree(data) {
     const ul = document.createElement('ul');
     data.forEach(item => {
     const li = document.createElement('li');

    const toggleButton = document.createElement('span');
    toggleButton.className = 'toggle-button';
    toggleButton.textContent = item.children && item.children.length > 0 ? '-' : '';
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        if (item.children && item.children.length > 0) {
            const childUl = li.querySelector('ul');
            if (childUl) {
                childUl.classList.toggle('hidden');
                toggleButton.textContent = childUl.classList.contains('hidden') ? '+' : '-';
            }
        }
    };

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = item.id;
            checkbox.value = item.label;

        // 체크박스 이벤트 리스너 추가
        checkbox.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('checkboxChanged', {
                detail: {
                    id: item.id,
                    label: item.label,
                    checked: e.target.checked,
                },
                bubbles: true,
                composed: true,
            }));

            // 선택된 체크박스 관리
            if (e.target.checked) {
                this.selectedItems.push(item.id);
            } else {
                this.selectedItems = this.selectedItems.filter(id => id !== item.id);
            }
        });

        const label = document.createElement('label');
        label.htmlFor = item.id;
        label.textContent = item.label || item.id;

        li.appendChild(toggleButton);
        li.appendChild(checkbox);
        li.appendChild(label);

        if (item.children && item.children.length > 0) {
            const childUl = this._generateTree(item.children);
            li.appendChild(childUl);
        }

        ul.appendChild(li);
    });
    return ul;
}

// 선택된 체크박스를 모두 해제하는 메소드
deselectAll() {
    this.selectedItems = []; // 선택된 아이템 배열 비우기
    const checkboxes = this._treeContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // 체크박스 해제
    });
}

// 선택된 체크박스의 ID 배열을 반환하는 메소드
getSelected() {
    return this.selectedItems; // 배열 반환
}
}

customElements.define('com-sapkorea-sac-sungjun-tree01', Main);
})();
