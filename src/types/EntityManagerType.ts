import { EntityManager } from "typeorm";
import { AppDataSource } from "../data-source";

export const entityManager: EntityManager = AppDataSource.manager;