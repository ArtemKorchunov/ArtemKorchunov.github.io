(function init() {
    this.arr = new Array(10);
    this.actions = [];
    this.redo = [];

    this.cells = document.querySelectorAll('div.cell'); 
    this.won_field = document.querySelector('div.won-title');
    this.field = cells[0].parentNode.parentNode;
    this.won_field.lastElementChild.onclick = restartGame.bind(this);
    document.querySelector('.undo-btn').onclick = undoField.bind(this);
    document.querySelector('.redo-btn').onclick = redoFields.bind(this);
    this.firstUndoEvent = true;

    addEvent('click');

    function isCross () {
        let isCross = false;
        return function toogle() {
            isCross = !isCross;
            return isCross;
        }
    }

    this.toogle = isCross();

    function drawSymbol(e) {
        if (e.target.textContent) return;
        createElem(e.target);
        if (this.actions[this.actions.length - 1] != this.redo[this.actions.length - 1])this.firstUndoEvent = true;
        if (winning(this.player)) check(this.player);
    }

    function createElem(target) {
        let target_attrs = target.attributes['data-id'].textContent;
        let elem = document.createElement('span');
        elem.className = 'symbol';
        this.player = toogle();
        this.arr[target_attrs] = player;
        elem.textContent = player? 'x': 'o';
        target.appendChild(elem);
        this.actions.push(target_attrs);
        return player;
    }

    function addEvent(e, elems = this.cells) {
        for (let elem of elems){
            elem.onclick = drawSymbol.bind(this);
        }
    }

    function redoFields() {
        if (this.firstUndoEvent) return 
        for (let i = this.actions.length; i < this.redo.length; i++){
            createElem(this.cells[this.redo[i]])
        }
        this.firstUndoEvent = true;
    }

    function undoField() {
        if (this.firstUndoEvent) {
            let time_arr = this.actions;
            this.redo = [...time_arr];
            this.firstUndoEvent = !this.firstUndoEvent;
        }
        if (!this.actions.length) return;
        let cur_index = this.actions[this.actions.length - 1];
        this.actions.splice(this.actions.length - 1,1);
        this.arr.splice(cur_index,1);
        let cur_cell = this.cells[cur_index];
        cur_cell.removeChild(cur_cell.firstElementChild);
        this.toogle();
    }

    function winning(player, board = this.arr){
        if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function restartGame() {
        this.field.classList.remove('hidden');
        this.won_field.classList.add('hidden');
        this.toogle();
    }

    function check(player) {
        this.won_field.classList.remove('hidden');
        this.field.classList.add('hidden');
        this.won_field.firstElementChild.textContent = player? 'Crosses win': 'Circles win';
        for (let cell of this.cells){
            if (cell.firstElementChild) cell.removeChild(cell.firstElementChild);
        }
        this.arr = [];
    }

})()

