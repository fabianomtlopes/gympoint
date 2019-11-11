import Bee from 'bee-queue';
import MatriculationMail from '../app/jobs/MatriculationMail';
import redisConfig from '../config/redis';

const jobs = [MatriculationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }
}

export default new Queue();
