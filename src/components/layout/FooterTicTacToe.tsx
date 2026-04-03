"use client";

import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const MOVE_PRIORITY = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function winner(board: Cell[], mark: 'X' | 'O'): boolean {
  return LINES.some((line) => line.every((idx) => board[idx] === mark));
}

function winningLine(board: Cell[], mark: 'X' | 'O'): number[] | null {
  return LINES.find((line) => line.every((idx) => board[idx] === mark)) ?? null;
}

function firstEmpty(board: Cell[], indices: number[]): number | null {
  for (const idx of indices) {
    if (board[idx] === null) return idx;
  }
  return null;
}

function bestAIMove(board: Cell[]): number | null {
  for (let i = 0; i < 9; i += 1) {
    if (board[i] !== null) continue;
    const test = [...board];
    test[i] = 'O';
    if (winner(test, 'O')) return i;
  }

  for (let i = 0; i < 9; i += 1) {
    if (board[i] !== null) continue;
    const test = [...board];
    test[i] = 'X';
    if (winner(test, 'X')) return i;
  }

  return firstEmpty(board, MOVE_PRIORITY);
}

export function FooterTicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [status, setStatus] = useState('Your move, Human.');
  const [cheatFlag, setCheatFlag] = useState(false);

  const isBoardFull = useMemo(() => board.every((cell) => cell !== null), [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setStatus('Your move, Human.');
    setCheatFlag(false);
  };

  const play = (index: number) => {
    if (board[index] !== null || winner(board, 'O') || isBoardFull) return;

    let next = [...board];
    next[index] = 'X';

    // Cheat layer: if player forms a winning line, silently jam it.
    if (winner(next, 'X')) {
      const line = winningLine(next, 'X');
      if (line) {
        const sabotage = line.find((idx) => idx !== index) ?? line[0];
        next[sabotage] = 'O';
      }
      setCheatFlag(true);
      setStatus('Signal jam detected. Nice try.');
    }

    const aiPick = bestAIMove(next);
    if (aiPick !== null) {
      next[aiPick] = 'O';
    }

    if (winner(next, 'O')) {
      setStatus('CDN Ops AI wins. Always.');
    } else if (next.every((cell) => cell !== null)) {
      setStatus('Stalemate. Network remains online.');
    } else if (cheatFlag) {
      setStatus('Your move. The AI is watching.');
      setCheatFlag(false);
    } else {
      setStatus('Your move.');
    }

    setBoard(next);
  };

  return (
    <div className="w-full md:w-auto md:min-w-[280px]">
      <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-3 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-red-400">Tic-Tac-Toe: Ops Mode</p>
        <p className="mt-1 text-xs text-neutral-300">You are X. The AI is O and absolutely not fair.</p>

        <div className="mt-4 grid w-fit grid-cols-[repeat(3,3rem)] grid-rows-[repeat(3,3rem)] gap-2 mx-auto">
          {board.map((cell, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => play(idx)}
              className="h-12 w-12 box-border m-0 p-0 appearance-none rounded-lg border border-white/10 bg-black/35 text-base font-bold text-neutral-100 hover:border-red-500/40 hover:bg-red-950/20 transition flex items-center justify-center"
              aria-label={`Play cell ${idx + 1}`}
            >
              {cell ?? ''}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-neutral-300">{status}</p>
        <button
          type="button"
          onClick={resetGame}
          className="mt-3 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-300 hover:border-red-500/40 hover:text-white transition"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}
