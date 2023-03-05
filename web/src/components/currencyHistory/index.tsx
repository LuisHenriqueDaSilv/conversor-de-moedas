
import { LineChart } from '../LineChart'

import styles from './styles.module.scss'

const data = {
    labels: ['a', 'b', 'c'],
    datasets: [
        {
            label: 'BRL->EUR',
            data: [1, 2, 1],
            borderColor: 'rgba(124, 58, 237, 1)',
            backgroundColor: 'rgba(124, 58, 237, 1)',
        },
    ],
};

export function CurrencyHistory() {
    return (
        <div className={styles.container}>
            <h1>Taxa de câmbio</h1>
            <LineChart 
                data={data} 
            />
        </div>
    )
}