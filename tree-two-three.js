// Класс дерева 2-3
class TreeTwoThree {
    constructor() {
        this.root = null;
    };

    isEmpty() {
        return this.root === null;
    };

    // Удаление целого узла из дерева 2-3
    deleteNode(anyNodeValue) {

    };

    // Удаление значения из узла дерева 2-3
    deleteValue(deleteValue) {

    };

    insert(newValue) {
        // Особое положение дерева, когда оно пустое
        if (this.isEmpty()) {
            const newNode = new NodeMultiPathTree(2);

            newNode.addData(newValue);

            this.root = newNode;

            return true;
        }

        // Устанавливаю динамическую ссылку для передвижения по дереву
        let current = this.root;

        while(true) {
            // Если мы добрались до листка, то мы можем говорить о том, что место вставки найдено
            if (current.isLeaf()) {
                // В узле есть свободное место, он не является полным, разбиение не требуется
                if (!current.isFull()) {
                    current.addData(newValue);

                    return true;
                }

                // В узле нет свободного места, его требуется разбивать
                const { newRoot } = current.split(newValue, null);

                // Особый случай, от разбиений мог создасться новый корень
                if (newRoot !== null && newRoot !== this.root) {
                    this.root = newRoot;
                }

                return true;
            }

            // Продолжаем искать место вставки
            current = current.nextChild(newValue);
        }
    };

    find(searchValue) {
        if (this.isEmpty()) {
            console.log('Tree-two-three is empty...');

            return {
                node: null,
                index: -1
            };
        }

        let current = this.root;

        while(true) {
            let j = 0;

            for (; j < current.length; j++) {
                const val = current.arrData[j];

                if (val === searchValue) {
                    return {
                        node: current,
                        index: j
                    };
                }

                if (val > searchValue) {
                    break;
                }
            }

            if (current.isLeaf()) {
                return {
                    node: current,
                    index: -1
                };
            }

            current = current.transitionToChildByIndex(j);
        }
    };

    // Вывод дерева посредством обхода в ширину
    display() {
        if (this.isEmpty()) {
            console.log('Tree-two-three is empty... Operation display() is not supported.');

        } else {
            let current = this.root;

            const stack = [current];

            while(stack.length) {
                const node = stack.shift();

                let strDraw = '';

                for (let j = 0; j < node.length; j++) {
                    const val = node.arrData[j];

                    if (strDraw === '') {
                        strDraw += val;

                    } else {
                        strDraw = strDraw + `, ${val}`;
                    }
                }

                console.log(strDraw);

                if (node.arrChildrens[0]) {
                    stack.push(node.arrChildrens[0]);
                }

                if (node.arrChildrens[1]) {
                    stack.push(node.arrChildrens[1]);
                }

                if (node.arrChildrens[2]) {
                    stack.push(node.arrChildrens[2]);
                }
            }
        }
    };
};
