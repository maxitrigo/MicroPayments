import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    category: string;
}
