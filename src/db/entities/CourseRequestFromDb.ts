import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { CourseFromDb } from '~/db/entities/CourseFromDb.js';
import { UserFromDb } from '~/db/entities/UserFromDb.js';

@Entity({
    name: 'courseRequests',
})
export class CourseRequestFromDb {
    @PrimaryGeneratedColumn()
    declare id: number;

    @ManyToOne(() => CourseFromDb, course => course.courseRequestsFromDb)
    declare course: Relation<CourseFromDb>;

    @ManyToOne(() => UserFromDb, user => user.courseRequestsFromDb)
    @JoinColumn()
    declare user: Relation<UserFromDb>;

    @Column({
        nullable: false,
    })
    declare status: string;
}
