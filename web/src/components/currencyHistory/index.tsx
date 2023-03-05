
import { CurrenciesContext } from '@/contexts/CurrenciesContext';
import { useContext } from 'react';
import { LineChart } from '../LineChart'

import styles from './styles.module.scss'

const constantData = {
    labels: ['a', 'b', 'c'],
    datasets: [
        {
            label: 'Nada -> nada',
            data: [1, 1, 1],
            borderColor: 'rgba(124, 58, 237, 1)',
            backgroundColor: 'rgba(124, 58, 237, 1)',
        },
    ],
};

export function CurrencyHistory() {

    const {
        currencyHistory
    } = useContext(CurrenciesContext)
    return (
        <div className={styles.container}>
            <h1>Taxa de câmbio</h1>
            <LineChart data={currencyHistory||constantData} />

        </div>
    )
}