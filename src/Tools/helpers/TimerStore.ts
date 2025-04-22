type TimerListener = (elapsed: number, isRunning: boolean) => void;

class TimerStore {
    private startTime: number | null = null;
    private elapsed: number = 0;
    private isRunning = false;
    private frameId: number | null = null;
    private listeners: TimerListener[] = [];

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

    getElapsed() {
        return this.elapsed;
    }

    getRunning() {
        return this.isRunning;
    }

    private tick = () => {
        if (!this.isRunning) return;
        const now = Date.now();
        const current = now - (this.startTime || now) + this.elapsed;
        this.notify(current);
        this.frameId = requestAnimationFrame(this.tick);
    };

    private notify(currentTime?: number) {
        const time = currentTime ?? this.elapsed;
        this.listeners.forEach((cb) => cb(time, this.isRunning));
    }

    subscribe(listener: TimerListener) {
        this.listeners.push(listener);
        listener(this.elapsed, this.isRunning); // initial push
        return () => {
            this.listeners = this.listeners.filter((cb) => cb !== listener);
        };
    }
}

export const timerStore = new TimerStore();
