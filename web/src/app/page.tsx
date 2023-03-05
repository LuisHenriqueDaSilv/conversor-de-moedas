import { Inter } from 'next/font/google'

const inter = Inter({
	subsets: ['latin'],
	weight: ["600", "400",]
})

import styles from './styles.module.scss'

import { CurrencyConverter } from '@/components/currencyConverter'
import { CurrencyHistory } from '@/components/currencyHistory'

export default function Home() {
	return (
		<div className={`${inter.className} ${styles.wrapper}`}>
			<div className={styles.app}>
				<CurrencyConverter />
				<CurrencyHistory/>
			</div>
		</div>
	)
}
