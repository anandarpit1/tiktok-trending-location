import { schedule, ScheduledTask } from "node-cron";

class JobCreator {
    protected job: ScheduledTask;
    constructor(frequency: string, callback: (...args: any[]) => void) {
        this.job = schedule(frequency, callback, { scheduled: false });
    }
}

export default JobCreator;
