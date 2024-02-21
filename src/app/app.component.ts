import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  leftPaddlePos = 350;
  rightPaddlePos = 350;
  isBallMoving = false;
  isArrowUpDown = false;
  isWKeyDown = false;
  isArrowDownPressed = false;
  isSKeyPressed = false;
  isSettingUpShot = true;
  leftUpTimeout!: any;
  rightUpTimeout!: any;
  leftDownTimeout!: any;
  rightDownTimeout!: any;
  ballTimeout!: any;
  server = 'playerOne';
  ballXPos = this.server === 'playerTwo' ? 1085 : 18;
  ballYPos = 342;
  ballDirection =
    this.server === 'playerTwo' ? 'diagonalUpLeft' : 'diagonalUpRight';
  ballSpeed = 2;
  playerOnePoints = 0;
  playerTwoPoints = 0;

  handleKeydown(e: KeyboardEvent) {
    if (!e.repeat) {
      switch (e.key) {
        case 'ArrowUp':
          this.isArrowUpDown = true;
          this.moveUp('rightPaddle');
          break;
        case 'w':
          this.isWKeyDown = true;
          this.moveUp('leftPaddle');
          break;
        case 'ArrowDown':
          this.isArrowDownPressed = true;
          this.moveDown('rightPaddle');
          break;
        case 's':
          this.isSKeyPressed = true;
          this.moveDown('leftPaddle');
          break;
      }
    }
  }

  handleKeyup(e: KeyboardEvent) {
    if (!e.repeat) {
      switch (e.key) {
        case 'ArrowUp':
          this.isArrowUpDown = false;
          clearTimeout(this.rightUpTimeout);
          break;
        case 'w':
          this.isWKeyDown = false;
          clearTimeout(this.leftUpTimeout);
          break;
        case 'ArrowDown':
          this.isArrowDownPressed = false;
          clearTimeout(this.rightDownTimeout);
          break;
        case 's':
          this.isSKeyPressed = false;
          clearTimeout(this.leftDownTimeout);
          break;
      }
    }
  }

  moveUp(paddle: string) {
    const loop = (paddleTwo: string) => {
      if (paddleTwo === 'left') {
        if (this.leftPaddlePos > 35 && this.isWKeyDown) {
          this.leftPaddlePos -= 5;

          if (this.isSettingUpShot && this.server === 'playerOne') {
            this.ballYPos -= 5;
          }

          this.leftUpTimeout = setTimeout(() => loop('left'), 10);
        }
      } else if (paddleTwo === 'right') {
        if (this.rightPaddlePos > 35 && this.isArrowUpDown) {
          this.rightPaddlePos -= 5;

          if (this.isSettingUpShot && this.server === 'playerTwo') {
            this.ballYPos -= 5;
          }

          this.rightUpTimeout = setTimeout(() => loop('right'), 10);
        }
      }
    };

    switch (paddle) {
      case 'rightPaddle':
        loop('right');
        break;
      case 'leftPaddle':
        loop('left');
        break;
    }
  }

  moveDown(paddle: string) {
    const loop = (paddleTwo: string) => {
      if (paddleTwo === 'left') {
        if (this.leftPaddlePos < 665 && this.isSKeyPressed) {
          this.leftPaddlePos += 5;

          if (this.isSettingUpShot && this.server === 'playerOne') {
            this.ballYPos += 5;
          }

          this.leftDownTimeout = setTimeout(() => loop('left'), 10);
        }
      } else if (paddleTwo === 'right') {
        if (this.rightPaddlePos < 665 && this.isArrowDownPressed) {
          this.rightPaddlePos += 5;

          if (this.isSettingUpShot && this.server === 'playerTwo') {
            this.ballYPos += 5;
          }

          this.rightDownTimeout = setTimeout(() => loop('right'), 10);
        }
      }
    };

    switch (paddle) {
      case 'rightPaddle':
        loop('right');
        break;
      case 'leftPaddle':
        loop('left');
        break;
    }
  }

  startGame() {
    this.isBallMoving = true;
    this.isSettingUpShot = false;
    this.moveBall();
  }

  moveBall() {
    switch (this.ballDirection) {
      case 'diagonalDownRight':
        this.ballXPos += this.ballSpeed;
        this.ballYPos += this.ballSpeed;
        break;
      case 'diagonalUpRight':
        this.ballXPos += this.ballSpeed;
        this.ballYPos -= this.ballSpeed;
        break;
      case 'diagonalDownLeft':
        this.ballXPos -= this.ballSpeed;
        this.ballYPos += this.ballSpeed;
        break;
      case 'diagonalUpLeft':
        this.ballXPos -= this.ballSpeed;
        this.ballYPos -= this.ballSpeed;
        break;
    }

    this.checkCollision(this.ballDirection);

    if (this.isBallMoving) {
      this.ballTimeout = setTimeout(() => this.moveBall(), 5);
    }
  }

  checkCollision(direction: string) {
    if (this.ballXPos <= -3) {
      this.playerTwoPoints += 1;
      this.resetGame('playerTwo');
    } else if (this.ballXPos >= 1110) {
      this.playerOnePoints += 1;
      this.resetGame('playerOne');
    } else if (this.ballYPos <= 0) {
      if (direction === 'diagonalUpRight') {
        this.ballDirection = 'diagonalDownRight';
      } else if (direction === 'diagonalUpLeft') {
        this.ballDirection = 'diagonalDownLeft';
      }
    } else if (this.ballYPos >= 690) {
      if (direction === 'diagonalDownRight') {
        this.ballDirection = 'diagonalUpRight';
      } else if (direction === 'diagonalDownLeft') {
        this.ballDirection = 'diagonalUpLeft';
      }
    } else if (
      this.ballXPos >= 1095 &&
      this.ballYPos >= this.rightPaddlePos - 38 &&
      this.ballYPos <= this.rightPaddlePos + 38
    ) {
      if (direction === 'diagonalUpRight') {
        this.ballDirection = 'diagonalUpLeft';
      } else if (direction === 'diagonalDownRight') {
        this.ballDirection = 'diagonalDownLeft';
      }
    } else if (
      this.ballXPos <= 10 &&
      this.ballYPos >= this.leftPaddlePos - 38 &&
      this.ballYPos <= this.leftPaddlePos + 38
    ) {
      if (direction === 'diagonalDownLeft') {
        this.ballDirection = 'diagonalDownRight';
      } else if (direction === 'diagonalUpLeft') {
        this.ballDirection = 'diagonalUpRight';
      }
    }
  }

  resetGame(server: string) {
    this.leftPaddlePos = 350;
    this.rightPaddlePos = 350;
    this.isArrowUpDown = false;
    this.isWKeyDown = false;
    this.isArrowDownPressed = false;
    this.isSKeyPressed = false;
    this.isBallMoving = false;
    this.isSettingUpShot = true;
    clearTimeout(this.leftUpTimeout);
    clearTimeout(this.rightUpTimeout);
    clearTimeout(this.leftDownTimeout);
    clearTimeout(this.rightDownTimeout);
    clearTimeout(this.ballTimeout);
    this.server = server;
    this.ballXPos = server === 'playerTwo' ? 1085 : 18;
    this.ballYPos = 342;
    this.ballDirection =
      server === 'playerTwo' ? 'diagonalUpLeft' : 'diagonalUpRight';
  }
}
