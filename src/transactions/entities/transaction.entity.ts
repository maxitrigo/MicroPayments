import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    clientId: string;

    @Column()
    productId: string;

    @Column()
    paymentType: string;

    @Column()
    amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column()
    comission: number;
}
