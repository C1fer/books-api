import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from  "typeorm"

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    author: string

    @Column({nullable: false})
    title: string

    @Column({nullable: false})
    genre: string

    @Column({nullable: false})
    isbn: string

    @Column({nullable: false})
    publisher: string

    @Column({nullable: false})
    publishedYear: string

    @Column({nullable: false})
    edition: string

    @Column({nullable: false})
    pages: number

    @Column({nullable: false, default: "CURRENT_TIMESTAMP"})
    dateAdded: Date
}