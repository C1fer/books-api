import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Book } from "./Book";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    username: string

    @Column({nullable: false})
    password: string

    @Column({nullable:true})
    email: string
    
    @Column({nullable: false, default: "CURRENT_TIMESTAMP"})
    dateAdded: Date

    @ManyToMany(() => Book) 
    @JoinTable({
        name: "reading_list",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "book_id", referencedColumnName: "id" }
    }) 
    readingList: Book[];
}