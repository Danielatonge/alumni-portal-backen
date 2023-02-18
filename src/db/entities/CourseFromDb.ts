import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { CourseTagFromDb } from '~/db/entities/CourseTagFromDb';
import { CourseRequestFromDb } from '~/db/entities/CourseRequestFromDb';

@Entity({
    name: 'courses',
})
export class CourseFromDb {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        nullable: false,
    })
    declare name: string;

    @Column({
        nullable: true,
    })
    declare description: string;

    @Column({
        nullable: false,
    })
    declare slotsAvailable: number;

    @Column({
        nullable: false,
    })
    declare startDate: Date;

    @Column({
        nullable: false,
    })
    declare endDate: Date;

    @Column('simple-array')
    declare teachers: string[];

    @Column({
        nullable: false,
    })
    declare autoConfirm: boolean;

    @ManyToMany(() => CourseTagFromDb)
    @JoinTable()
    declare tagsFromDb: Relation<CourseTagFromDb[]>;

    @OneToMany(() => CourseRequestFromDb, courseRequest => courseRequest.course)
    declare courseRequestsFromDb: Relation<CourseRequestFromDb[]>;
}
