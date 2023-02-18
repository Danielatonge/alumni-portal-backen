import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: "tags"
})
export class CourseTagFromDb {

    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        nullable: false
    })
    declare name: string;
}