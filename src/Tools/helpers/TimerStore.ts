type TimerListener = (
    displayTime: number,
    isRunning: boolean,
    modeTimer: boolean,
    targetTime: number
) => void;

class TimerStore {
    private startTime: number | null = null;
    private elapsed: number = 0;
    private isRunning = false;
    private frameId: number | null = null;
    private listeners: TimerListener[] = [];

    private modeTimer: boolean = false;
    private targetTime: number = 0;
    private onTimeout: (() => void) | null = null;

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now();
        this.tick();
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.elapsed += Date.now() - (this.startTime || Date.now());
        if (this.frameId) cancelAnimationFrame(this.frameId);
        this.notify();
    }

    reset() {
        this.elapsed = 0;
        this.startTime = null;
        this.isRunning = false;
        if (this.frameId) cancelAnimationFrame(this.frameId);
        this.notify();
    }

    maximize() {
        this.notify();
    }

    getElapsed() {
        const now = Date.now();
        return this.isRunning && this.startTime
            ? now - this.startTime + this.elapsed
            : this.elapsed;
    }

    getDisplayTime() {
        const base = this.modeTimer ? this.targetTime : 0;
        return this.modeTimer
            ? Math.max(base - this.getElapsed(), 0)
            : this.getElapsed();
    }

    getIsRunning() {
        return this.isRunning;
    }

    getModeTimer() {
        return this.modeTimer;
    }

    getTargetTime() {
        return this.targetTime;
    }

    setModeTimer(enabled: boolean) {
        this.modeTimer = enabled;
        this.notify();
    }

    setTargetTime(ms: number) {
        this.targetTime = ms;
        this.notify();
    }

    setOnTimeout(callback: () => void) {
        this.onTimeout = callback;
    }

    private tick = () => {
        if (!this.isRunning) return;

        const currentElapsed = this.getElapsed();
        const remaining = this.targetTime - currentElapsed;

        if (this.modeTimer && this.targetTime > 0 && remaining <= 0) {
            this.pause();
            if (this.onTimeout) this.onTimeout();
            return;
        }

        this.notify();
        this.frameId = requestAnimationFrame(this.tick);
    };

    private notify() {
        const time = this.getDisplayTime();
        this.listeners.forEach((cb) =>
            cb(time, this.isRunning, this.modeTimer, this.targetTime)
        );
    }

    subscribe(listener: TimerListener) {
        this.listeners.push(listener);
        this.notify();
        return () => {
            this.listeners = this.listeners.filter((cb) => cb !== listener);
        };
    }
}

export const timerStore = new TimerStore();
