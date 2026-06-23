import { create } from 'zustand';

interface TimerStore {
  timeLeft: number;
  setTimeLeft: (time: number) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  timeLeft: parseInt(localStorage.getItem('timer_timeLeft') || '1500', 10),
  setTimeLeft: (time) => {
    localStorage.setItem('timer_timeLeft', time.toString());
    set({ timeLeft: time });
  }
}));
