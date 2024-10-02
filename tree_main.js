const getScriptPromisify = (src) => {
    return new Promise((resolve) => {
        $.getScript(src, resolve);
    });
};

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

            const { data } = dataBinding;  
            const { dimensions } = parseMetadata(data); 

            this._treeContainer.innerHTML = ''; 
            const ul = this._generateTree(dimensions); 
            this._treeContainer.appendChild(ul);
        }

        _generateTree(data) {
            const ul = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = item.id;
                checkbox.value = item.label;

                const label = document.createElement('label');
                label.htmlFor = item.id;
                label.textContent = item.label || item.id;

                li.appendChild(checkbox);
                li.appendChild(label);

                if (item.children && item.children.length > 0) {
                    const childUl = this._generateTree(item.children);
                    li.appendChild(childUl);
                } 
                // 자식 노드가 없는 경우에는 아무것도 하지 않음

                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (item.children && item.children.length > 0) {
                        const childUl = li.querySelector('ul');
                        childUl.classList.toggle('hidden');
                    }
                });

                ul.appendChild(li);
            });
            return ul;
        }
    }

    customElements.define('com-sapkorea-sac-sungjun-tree01', Main);
})();



