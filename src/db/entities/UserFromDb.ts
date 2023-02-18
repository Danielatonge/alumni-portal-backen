import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Relation,
} from 'typeorm';
import { IsEmail, Validate } from 'class-validator';
import { InnopolisEmailValidator } from '~/helpers/InnopolisEmailValidator';
import { CourseRequestFromDb } from '~/db/entities/CourseRequestFromDb';

@Entity({
    name: 'users',
})
export class UserFromDb {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({
        nullable: true,
    })
    declare firstName: string;

    @Column({
        nullable: true,
    })
    declare lastName: string;

    @Column({
        nullable: true,
    })
    declare dateGraduation: Date;

    @Column({
        unique: true,
        nullable: false,
    })
    @IsEmail()
    @Validate(InnopolisEmailValidator)
    declare email: string;

    @Column({
        nullable: true,
    })
    declare passwordHash: string;

    @Column({
        nullable: false,
    })
    declare role: string;

    @Column({
        type: 'simple-json',
        nullable: true,
    })
    declare history: string;

    @OneToMany(() => CourseRequestFromDb, courseRequest => courseRequest.user)
    declare courseRequestsFromDb: Relation<CourseRequestFromDb[]>;
}
