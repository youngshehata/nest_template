import { HttpException } from '@nestjs/common';
import {
  CONST_DEFAULT_PAGE,
  CONST_DEFAULT_PAGE_SIZE,
} from '../constraints/pagination/pagination.constraints';

export abstract class AbstractRepo<
  TDelegate extends {
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
    findUnique: (...args: any[]) => any;
    count: (...args: any[]) => any;
  },
> {
  constructor(protected readonly delegate: TDelegate) {}

  //! ===============================>   FIND MANY   <===============================
  async findMany(
    args?: Parameters<TDelegate['findMany']>[0],
    pageSize: number = CONST_DEFAULT_PAGE_SIZE,
    pageNumber: number = CONST_DEFAULT_PAGE,
  ): Promise<{
    data: Awaited<ReturnType<TDelegate['findMany']>>;
    totalCount: number;
  }> {
    try {
      const where = args?.where;

      const [data, totalCount] = await Promise.all([
        this.delegate.findMany({
          ...args,
          take: Number(pageSize),
          skip: Number((pageNumber - 1) * pageSize),
        }),
        this.delegate.count({ where }),
      ]);

      return { data, totalCount };
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   FIND ONE   <===============================
  async findOne(
    args: Parameters<TDelegate['findUnique']>[0],
  ): Promise<ReturnType<TDelegate['findUnique']>> {
    try {
      const found = await this.delegate.findUnique(args);
      if (!found) {
        throw new HttpException(`Entity Not found`, 404);
      }
      return found;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Create   <===============================
  async create(
    args: Parameters<TDelegate['create']>[0],
  ): Promise<ReturnType<TDelegate['create']>> {
    try {
      const created = await this.delegate.create(args);
      return created;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Update One   <===============================
  async updateOne(
    args: Parameters<TDelegate['update']>[0],
  ): Promise<ReturnType<TDelegate['update']>> {
    try {
      const result = await this.delegate.update(args);
      return result;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }

  //! ===============================>   Delete One   <===============================
  async delete(
    args: Parameters<TDelegate['delete']>[0],
  ): Promise<ReturnType<TDelegate['delete']>> {
    try {
      const deleted = await this.delegate.delete(args);
      if (!deleted) {
        throw new HttpException('Entity Not found', 404);
      }

      return deleted;
    } catch (error) {
      if (error.meta?.cause) {
        throw new HttpException(error.meta.cause, 400);
      }
      throw error;
    }
  }
}
