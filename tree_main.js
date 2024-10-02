var getScriptPromisify = (src) => {
    return new Promise((resolve) => {
        $.getScript(src, resolve);
    });
};

var parseMetadata = metadata => {
    const { dimensions: dimensionsMap } = metadata;
    const dimensions = [];
    
    for (const key in dimensionsMap) {
        const dimension = dimensionsMap[key];
        dimensions.push({ key, ...dimension });
    }
    
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
            li {
                cursor: pointer;
                margin: 5px 0;
            }
            .hidden {
                display: none;
            }
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
    `;
    
    class Main extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._root = this._shadowRoot.getElementById('root');
            this._treeContainer = document.createElement('div');
            this._root.appendChild(this._treeContainer);
        }

        onCustomWidgetResize(width, height) {
            this.render();
        }

        onCustomWidgetAfterUpdate(changedProps) {
            this.render();
        }

        onCustomWidgetDestroy() {
            // 필요한 경우 리소스를 정리합니다.
        }

        async render() {
            const dataBinding = this.dataBinding;
            if (!dataBinding || dataBinding.state !== 'success') {
                return;
            }

            const { metadata } = dataBinding;
            const { dimensions } = parseMetadata(metadata);

            this._treeContainer.innerHTML = ''; // 이전 내용을 비웁니다.
            const ul = this._generateTree(dimensions);
            this._treeContainer.appendChild(ul);
        }

        _generateTree(data) {
            const ul = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.label || item.key;

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
