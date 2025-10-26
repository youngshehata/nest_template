import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Connection, FilterQuery, Model, SaveOptions } from 'mongoose';

export abstract class AbstractDocument<TDocument> {
  constructor(
    private readonly connection: Connection,
    private readonly model: Model<TDocument>,
  ) {}

  //! Create New Document
  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    try {
      const createdDocument = new this.model(document);
      await createdDocument.save(options);
      return createdDocument.toJSON() as unknown as TDocument;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //! Find One
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    try {
      const result = await this.model.findOne(filterQuery);
      if (!result) {
        throw new NotFoundException('Document was not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //! Find Many
  async findMany(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    try {
      const result = await this.model.find(filterQuery);
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //! Update One
  async updateOne(
    updateData: Partial<TDocument>,
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    try {
      const updatedDoc = await this.model.findOneAndUpdate(
        filterQuery,
        { $set: updateData },
        { new: true },
      );

      if (!updatedDoc) {
        throw new NotFoundException('Document was not found to be updated');
      }

      return updatedDoc;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //! Delete One
  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    try {
      const result = await this.model.findOne(filterQuery);
      if (!result) {
        throw new NotFoundException('Document was not found to be deleted');
      }
      await this.model.deleteOne(result);
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
