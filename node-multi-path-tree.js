// Класс многопутевого узла для дерева 2-3
class NodeMultiPathTree {
    constructor(maxValue) {
        this.parent = null;
        this.arrData = new Array(maxValue);
        this.arrChildrens = new Array(maxValue + 1);
        this.length = 0;
        this.connections = 0;
    };

    isEmpty() {
        return this.length === 0;
    };

    isFull() {
        return this.length === this.arrData.length;
    };

    isFullConnection() {
        return this.connections === this.arrChildrens.length;
    };

    isNotConnection() {
        return this.connections === 0;
    };

    isLeaf() {
        return this.connections === 0;
    };

    getFirstValue() {
        if (this.isEmpty()) {
            throw new Error('Node multi path tree is empty... Operation getFirstValue() is not supported...');
        }

        return this.arrData[0];
    };

    addData(newValue) {
        if (this.isFull()) {
            throw new Error(`Node multi path tree is full... Value - ${newValue} is not add.`);
        }

        let j = this.length;

        while(j > 0 && this.arrData[j - 1] > newValue) {
            this.arrData[j] = this.arrData[j - 1];

            j--;
        }

        this.arrData[j] = newValue;

        this.length = this.length + 1;

        return j;
    };

    nextChild(value) {
        let i = 0;

        for (; i < this.length; i++) {
            const val = this.arrData[i];

            if (val > value) {
                break;
            }
        }

        return this.arrChildrens[i];
    };

    transitionToChildByIndex(index) {
        if (this.isNotConnection()) {
            throw new Error('Node multi path tree has no children... Operation transitionToChildByIndex() is not supported.');
        }

        const node = this.arrChildrens[index];

        if (!node) {
            throw new Error('Node multi path tree is not found... Index is not correct...');
        }

        return node;
    };

    eraseAndUpdate(value) {
        this.arrData[0] = value;
        this.arrData[1] = undefined;
        this.length = 1;
    };

    determineChildPositionByTopValue(topValue) {
        if (this.isNotConnection()) {
            throw new Error('The parent node has no children... Operation determineChildPositionByTopValue() is not supported...');
        }

        let j = 0;

        for (; j < this.length; j++) {
            const valNode = this.arrData[j];

            if (valNode > topValue) {
                break;
            }
        }

        if (j === 0) {
            return 'left';
        }

        if (j === 1) {
            return 'mid';
        }

        if (j === 2) {
            return 'right';
        }

        return 'not-found';
    };

    connectLinksRelativeChildPosition(position, newChildRight, newNode) {
        switch(position) {
            case 'left': {
                // Если бьется родитель, у которого ребенок, породивший разбиения, слева, то у родителя нужно отсоединить два крайних потомка и добавить их новому узлу, а текущему узлу добавить newNode
                const rightChild = this.disconnectLastChild();
                const midChild = this.disconnectLastChild();

                newChildRight.connectChild(midChild);
                newChildRight.connectChild(rightChild);
                this.connectChild(newNode);
            }
            break;
            case 'mid': {
                // Если бьется родитель, у которого ребенок, породивший разбиения, по середине, то у родителя нужно отсоединить один крайний и добавить его новому узлу, а также надо взять крайнее значение потомка и тоже отдать его новому узлу
                const rightChild = this.disconnectLastChild();

                newChildRight.connectChild(newNode);
                newChildRight.connectChild(rightChild);
            }
            break;
            case 'right': {
                // Если бьется родитель, у которого ребенок, породивший разбиения, находится справа, то крайний правый у родителя отрывается и становится потомков его нового узла, пришедший правый тоже становится его потомком, а середина уходит вверх
                const rightChild = this.disconnectLastChild();

                newChildRight.connectChild(rightChild);
                newChildRight.connectChild(newNode);
            }
            break;
            default:
                // Произошло что-то непредвиденное, позиция ребенка не была установлена корректно
                throw new Error('Unexpected error! Not-found position child.');
        }
    };

    split(valueSplit, newNode) {
        // Если узел не заполнен, то в него вставка происходит спокойно
        if (!this.isFull()) {
            this.addData(valueSplit);

            if (newNode) {
                this.connectChild(newNode);
            }

            return {
                newRoot: null
            };
        }

        const arrItems = [...this.arrData];

        let j = arrItems.length;

        // Формируем правильную последовательность массива из трех элементов
        while(j > 0 && valueSplit < arrItems[j - 1]) {
            arrItems[j] = arrItems[j - 1];

            j--;
        }

        arrItems[j] = valueSplit;

        // Создаем правую часть
        const newChildRight = new NodeMultiPathTree(this.arrData.length);
        newChildRight.addData(arrItems[2]);

        if (this.parent) {
            if (newNode) {
                // Определяем позицию ребенка, который вызвал рекурсивные разбиения
                const childPosition = this.determineChildPositionByTopValue(valueSplit);

                // В зависимости от того, с какой стороны располагается разбиваемый потомок, мы тем или иным образом переставляем ссылки родителя и его детей
                this.connectLinksRelativeChildPosition(childPosition, newChildRight, newNode);
            }

            // Очищаем текущий узел, оставляя один элемент, только после того, как мы определим позицию разбиваемого ребенка - это важно
            this.eraseAndUpdate(arrItems[0]);

            return this.parent.split(arrItems[1], newChildRight);
        }

        // Родителя нет, требуется создать нового и раскидать все ссылки
        const newRoot = new NodeMultiPathTree(this.arrData.length);
        newRoot.addData(arrItems[1]);

        newRoot.connectChild(this);
        newRoot.connectChild(newChildRight);

        if (newNode) {
            // Определяем позицию ребенка, который вызвал рекурсивные разбиения
            const childPosition = this.determineChildPositionByTopValue(valueSplit);

            // В зависимости от того, с какой стороны располагается разбиваемый потомок, мы тем или иным образом переставляем ссылки родителя и его детей
            this.connectLinksRelativeChildPosition(childPosition, newChildRight, newNode);
        }

        // Очищаем текущий узел, оставляя один элемент, только после того, как мы определим позицию разбиваемого ребенка - это важно
        this.eraseAndUpdate(arrItems[0]);

        return {
            newRoot
        };
    };

    connectChild(nodeChild) {
        if (this.isFullConnection()) {
            throw new Error('Node multi path tree is full connections... Operation connectChild() is not supported...');
        }

        let j = this.connections;

        const childValue = nodeChild.getFirstValue();

        for (; j > 0; j--) {
            const val = this.arrChildrens[j - 1].getFirstValue();

            if (val > childValue) {
                this.arrChildrens[j] = this.arrChildrens[j - 1];

                continue;
            }

            break;
        }

        this.arrChildrens[j] = nodeChild;

        nodeChild.parent = this;

        this.connections = this.connections + 1;
    };

    disconnectLastChild() {
        if (this.isNotConnection()) {
            return null;
        }

        this.connections = this.connections - 1;

        const removeChild = this.arrChildrens[this.connections];

        this.arrChildrens[this.connections] = undefined;

        removeChild.parent = null;

        return removeChild;
    };
};
