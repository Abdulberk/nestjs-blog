import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const awaitedDocument = await createdDocument.save();

    return awaitedDocument.toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found in the database', filterQuery);
      throw new NotFoundException('Document was not found !');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found in the database', filterQuery);
      throw new NotFoundException('Document was not found !');
    }

    return document;
  }

  async updateOne(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .updateOne(filterQuery, update)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found in the database', filterQuery);
      throw new NotFoundException('Document was not found !');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    const documents = await this.model
      .find(filterQuery)
      .lean<TDocument[]>(true);

    return documents;
  }

  async delete(filterQuery: FilterQuery<TDocument>): Promise<void> {
    const deletionResult = await this.model.deleteOne(filterQuery);

    if (deletionResult.deletedCount === 0) {
      this.logger.warn('Document was not found in the database', filterQuery);
      throw new NotFoundException(
        'Document was not found and could not be deleted !',
      );
    }
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
