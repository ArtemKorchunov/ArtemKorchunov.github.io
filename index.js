(function init() {
    initProps();
    this.cells = document.querySelectorAll('div.cell');

    this.won_field = document.querySelector('div.won-title');
    this.field = cells[0].parentNode.parentNode;

    this.won_field.lastElementChild.onclick = restartGame.bind(this);

    this.undo_btn =  document.querySelector('.undo-btn')
    undo_btn.onclick = undoField.bind(this);
    this.redo_btn =  document.querySelector('.redo-btn');
    redo_btn.onclick = redoFields.bind(this);

    changeStateEvent(true, 'onclick');

    function changeStateEvent(ifAdd, e, elems = this.cells) {
        let insertVal = ifAdd? drawSymbol.bind(this): null;
        for (let elem of elems){
            elem[e] = insertVal;
        }
    }

    function delEvent(e, elems = this.cells) {
        for (let elem of elems){
            elem[e] = drawSymbol.bind(this);
        }
    }

    this.isCross = true;
    function toogle() {
        this.isCross = !isCross;
        return this.isCross;
    }

    function initProps() {
        this.arr = new Array(9);
        this.actions = [];
        this.redo = [];
        this.firstUndoEvent = true;
        this.ifDraw = false;
    }

    function drawSymbol(e) {
        if (e.target.className.split(' ')[1]) return;
        createElem(e.target);
        if (this.actions[this.actions.length - 1] != this.redo[this.actions.length - 1]){ 
            this.firstUndoEvent = true;
            this.redo_btn.setAttributeNode(document.createAttribute('disabled'));
        }
        this.undo_btn.removeAttribute('disabled');
        if (winning()) check();
        toogle();
        console.log(this.arr)
    }

    function createElem(target) {
        let target_attrs = target.attributes['data-id'].textContent;
        this.arr[target_attrs] = this.isCross;
        target.className += this.isCross ? ' ch': ' r';
        this.actions.push(target_attrs);
    }

    function redoFields() {
        if (this.firstUndoEvent) return 
        for (let i = this.actions.length; i < this.redo.length; i++){
            createElem(this.cells[this.redo[i]])
            toogle();
        }
        this.firstUndoEvent = true;
        
        this.redo_btn.setAttributeNode(document.createAttribute('disabled'));
        this.undo_btn.removeAttribute('disabled');

    }

    function undoField() {
        if (this.firstUndoEvent) {
            this.redo = [...this.actions];
            this.firstUndoEvent = !this.firstUndoEvent;
            this.redo_btn.removeAttribute('disabled');
        }
        if (!this.actions.length) {
            return;
        }
        let cur_index = this.actions[this.actions.length - 1];
        this.actions.splice(this.actions.length - 1,1);
        delete arr[cur_index];
        this.cells[cur_index].className = 'cell';
        if (!this.actions.length){
            this.undo_btn.setAttributeNode(document.createAttribute('disabled'));
        }
        toogle();
    }
    function drawWinLine(i, step, txt) {
        let count= 1;
        while (count <= 3){
            this.cells[i].className += ` win ${txt}`
            i+=step;
            count++;
        }
    }

    function winning(player = this.isCross, game = this.arr){
        let ifWin = false;

        // horizontal wins
        for (i = 0; i <= 6; i += 3)
        {
            if (game[i] === player && game[i + 1] === player && game[i + 2] === player){
                drawWinLine(i, 1, 'horizontal');
                return true;
            }
            
        }

        // vertical wins
        for (i = 0; i <= 2; i++)
        {
            if (game[i] === player && game[i + 3] === player && game[i + 6] === player){
                drawWinLine(i, 3, 'vertical');
                return 2;
            }
            
        }

        // diagonal wins
        if (game[0] === player && game[4] === player && game[8] === player){
            drawWinLine(0,4, 'diagonal-right');
            return true;
        }
        else if (game[2] === player && game[4] === player && game[6] === player){
            drawWinLine(2,2, 'diagonal-left');
            return true;
        }

        if(ifFullArr(this.arr)){
            this.ifDraw = true;
            return true;
        } 
        return false;
    }

    function ifFullArr(arr) {
        let length = 0;
        for (let val of arr){
            if (val == undefined) return false;
            length++;
        }
        return length == this.arr.length;
    }

    function restartGame() {
        for (let cell of this.cells){
            if (cell.classList[cell.classList.length - 1]) cell.className = 'cell';
        }
        this.field.classList.remove('hidden');
        this.won_field.classList.add('hidden');
        if(!this.isCross) toogle();
        initProps();
        changeStateEvent(true, 'onclick');
    }

    function check() {
        this.won_field.classList.remove('hidden');
        
        this.won_field.firstElementChild.textContent = this.ifDraw?  "It's a draw!": this.isCross ? 'Crosses won!': 'Toes won!';
        changeStateEvent(false, 'onclick')
        this.undo_btn.setAttributeNode(document.createAttribute('disabled'));
        this.redo_btn.setAttributeNode(document.createAttribute('disabled'));
    }

})()

