
    // Floating label input filled class toggle
    document.querySelectorAll('.input-group input').forEach(input => {
      input.addEventListener('input', e => {
        if (e.target.value.trim() !== '') {
          e.target.classList.add('filled');
        } else {
          e.target.classList.remove('filled');
        }
      });
      if (input.value.trim() !== '') {
        input.classList.add('filled');
      }
    });

    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const setupForm = document.getElementById('setup-form');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const player2Group = document.getElementById('player2-group');
    const gameModeSelect = document.getElementById('game-mode');
    const startGameBtn = document.getElementById('start-game');
    const newGameBtn = document.getElementById('new-game');
    const backToStartBtn = document.getElementById('back-to-start');
    const gameBoard = document.getElementById('game-board');
    const messageContainer = document.getElementById('message');
    const cells = Array.from(document.querySelectorAll('.cell'));

    let player1Name = '';
    let player2Name = '';
    let gameMode = '2players';
    let turnO = true; // true means X's turn, false means O's turn

    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];

    // Show/hide player2 name input according to game mode
    gameModeSelect.addEventListener('change', () => {
      if(gameModeSelect.value === 'computer') {
        player2Group.style.display = 'none';
        player2Input.value = 'Computer';
        player2Input.classList.add('filled');
      } else {
        player2Group.style.display = 'block';
        player2Input.value = '';
        player2Input.classList.remove('filled');
      }
    });

    // Helper: fade between pages
    function showPage(showElem, hideElem) {
      hideElem.classList.remove('active');
      showElem.classList.add('active');
    }

    // Reset board cells
    function resetBoard() {
      cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('win-cell', 'x', 'o');
      });
      messageContainer.textContent = '';
      messageContainer.classList.remove('fade-in');
    }

    // Check win or draw
    function checkWinner() {
      for (const pattern of winPatterns) {
        const [a,b,c] = pattern;
        const v1 = cells[a].textContent;
        const v2 = cells[b].textContent;
        const v3 = cells[c].textContent;
        if (v1 && v1 === v2 && v2 === v3) {
          // Mark winning cells
          pattern.forEach(i => cells[i].classList.add('win-cell'));
          return v1;
        }
      }
      if (cells.every(c => c.textContent)) return 'draw';
      return null;
    }

    // Disable all cells
    function disableCells() {
      cells.forEach(cell => cell.disabled = true);
    }

    // Computer Move: pick random empty cell
    function computerMove() {
      const emptyCells = cells.filter(c => c.textContent === '');
      if (!emptyCells.length) return;
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      cell.textContent = 'O';
      cell.disabled = true;
      cell.classList.add('o');
      turnO = true;
      const winner = checkWinner();
      if (winner) endGame(winner);
      else updateTurnMessage();
    }

    // Update turn message
    function updateTurnMessage() {
      if (turnO) {
        messageContainer.textContent = `${player1Name}'s (X) turn`;
      } else if (gameMode === '2players') {
        messageContainer.textContent = `${player2Name}'s (O) turn`;
      } else {
        messageContainer.textContent = `Computer's (O) turn`;
      }
    }

    // Handle move click
    function handleMove(cell) {
      if(cell.textContent !== '' || cell.disabled) return;
      if(turnO){
        cell.textContent = 'X';
        cell.disabled = true;
        cell.classList.add('x');
        turnO = false;
      } else {
        if(gameMode === '2players') {
          cell.textContent = 'O';
          cell.disabled = true;
          cell.classList.add('o');
          turnO = true;
        } else {
          return; // Ignore other clicks if vs computer and it's O's turn
        }
      }
      const winner = checkWinner();
      if(winner) {
        endGame(winner);
      } else if(gameMode === 'computer' && !turnO) {
        setTimeout(computerMove, 500);
      } else {
        updateTurnMessage();
      }
    }

    // End game handler
    function endGame(winner) {
      disableCells();
      let message = '';
      if(winner === 'draw') {
        message = "It's a draw!";
      } else {
        const winnerName = winner === 'X' ? player1Name : player2Name;
        message = `🎉 Congratulations, Winner is ${winnerName}! 🎉`;
      }
      messageContainer.textContent = message;
      messageContainer.classList.add('fade-in');
    }

    // Start game submission
    setupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const p1 = player1Input.value.trim();
      const p2 = (gameModeSelect.value === 'computer') ? 'Computer' : player2Input.value.trim();

      if(!p1) {
        alert('Please enter Player 1 name.');
        player1Input.focus();
        return;
      }
      if(gameModeSelect.value === '2players' && !p2) {
        alert('Please enter Player 2 name.');
        player2Input.focus();
        return;
      }

      player1Name = p1;
      player2Name = p2;
      gameMode = gameModeSelect.value;

      // Hide start screen show game
      resetBoard();
      turnO = true;
      showPage(gameScreen, startScreen);

      updateTurnMessage();
      messageContainer.classList.remove('fade-in');
    });

    // Cell clicks
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if(!cell.disabled){
          handleMove(cell);
        }
      });
    });

    // New game button
    newGameBtn.addEventListener('click', () => {
      resetBoard();
      turnO = true;
      updateTurnMessage();
      messageContainer.classList.remove('fade-in');
    });

    // Back to start button
    backToStartBtn.addEventListener('click', () => {
      resetBoard();
      player1Input.value = '';
      player2Input.value = '';
      player1Input.classList.remove('filled');
      player2Input.classList.remove('filled');
      gameModeSelect.value = '2players';
      player2Group.style.display = 'block';
      showPage(startScreen, gameScreen);
      messageContainer.textContent = '';
      messageContainer.classList.remove('fade-in');
    });

    // Initial setup UI state
    (() => {
      if(gameModeSelect.value === 'computer') {
        player2Group.style.display = 'none';
        player2Input.value = 'Computer';
        player2Input.classList.add('filled');
      } else {
        player2Group.style.display = 'block';
        player2Input.value = '';
        player2Input.classList.remove('filled');
      }
    })();
