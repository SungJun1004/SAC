const getScriptPromisify = (src) => {
    return new Promise((resolve) => {
        $.getScript(src, resolve);
    });
};

const parseMetadata = (data) => {
    const dimensionsMap = {};
    const dimensions = [];

    // 데이터 배열을 통해 차원 정보를 수집
    data.forEach(item => {
        const dimension = item.dimensions_0;
        const measure = item.measures_0;

        if (dimension) {
            const { id, label, parentId } = dimension;
            const dimObj = { id, label, parentId, measures: measure };

            // 차원 객체를 맵에 추가
            dimensionsMap[id] = dimObj;

            // 루트 노드인 경우 dimensions 배열에 추가
            if (!parentId) {
                dimensions.push(dimObj);
            }
        }
    });

    // 자식 노드 관계 설정
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
            }
            .hidden {
                display: none;
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
        }

        onCustomWidgetResize(width, height) {
            this.render();
        }

        onCustomWidgetAfterUpdate(changedProps) {
            this.render();
        }

        onCustomWidgetDestroy() {
            // 필요한 경우 추가 정리 작업 수행
        }

        async render() {
            const dataBinding = this.dataBinding;
            if (!dataBinding || dataBinding.state !== 'success') {
                return;
            }

            const { data } = dataBinding;  // 데이터 배열을 가져옵니다.
            const { dimensions } = parseMetadata(data); // 메타데이터를 파싱합니다.

            this._treeContainer.innerHTML = ''; // 이전 내용을 비웁니다.
            const ul = this._generateTree(dimensions); // 트리 생성
            this._treeContainer.appendChild(ul);
        }

        _generateTree(data) {
            const ul = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.label || item.id;

                if (item.children && item.children.length > 0) {
                    li.appendChild(this._generateTree(item.children)); // 자식 요소 생성
                }

                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.querySelector('ul').classList.toggle('hidden'); // 자식 리스트 토글
                });

                ul.appendChild(li);
            });
            return ul;
        }
    }

    customElements.define('com-sapkorea-sac-sungjun-tree01', Main);
})();
