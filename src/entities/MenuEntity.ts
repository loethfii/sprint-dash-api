import { BaseTableEntity } from "./BaseTableEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity({ name: "menus" })
export class MenuEntity extends BaseTableEntity {
    @OneToMany(() => UserEntity, (user) => user.menu)
    users: UserEntity[];
}