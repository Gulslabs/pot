import { Repository } from 'typeorm';

export abstract class AbstractService {
  protected constructor(protected readonly repo: Repository<any>) {}

  async save(options) {
    return this.repo.save(options);
  }

  async find(options = {}) {
    return this.repo.find(options);
  }
  async findOne(options) {
    return this.repo.save(options);
  }

  async update(id, options) {
    return this.repo.update(id, options);
  }
}
