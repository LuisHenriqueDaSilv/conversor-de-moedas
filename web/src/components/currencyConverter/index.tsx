"use client"

import { useEffect, useState } from 'react'

import Image from 'next/image'

import styles from './styles.module.scss'

import currencies from '../../../datas/currencies.json'

export function CurrencyConverter() {

    const [bidCurrency, setBidCurrency] = useState<number>(1)

    const [firstCurrencyValue, setFirstCurrencyValue] = useState(1)
    const [secondCurrencyValue, setSecondCurrencyValue] = useState(1)

    const [fromCurrencySymbol, setFromCurrencySymbol] = useState<string>('AED')
    const [toCurrencySymbol, setToCurrencySymbol] = useState<string>('AED')

    function stringNumberWithCommas(value: number) {
        return value.toLocaleString('en-US')
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        const targetId = event.target.id as 'first' || 'second'
        const eventValue = Number(event.target.value?.replaceAll(',', ''))

        if (targetId == 'first') {
            setFirstCurrencyValue(eventValue)
            setSecondCurrencyValue(Number((eventValue * bidCurrency).toFixed(2)))
        } else {
            setFirstCurrencyValue(Number((eventValue / bidCurrency).toFixed(2)))
            setSecondCurrencyValue(eventValue)
        }

    }

    async function fetchBidCurrency() {

        console.log('fetch')

        const apikey = process.env.ALPHA_VANTAGE_API_KEY || ''

        const response = await fetch(
            "https://www.alphavantage.co/query?" + new URLSearchParams({
                function:'FX_DAILY',
                from_symbol:fromCurrencySymbol,
                to_symbol: toCurrencySymbol,
                outputsize:'compact',
                apikey
            }) 
        )

        const responseData = await response.json()

        const dailys = responseData["Time Series FX (Daily)"]

        if(!dailys){
            //TODO: Return error
            console.log('error:')
            console.log(responseData)
            return 
        }

        const dailysDays = Object.keys(dailys)
        const lastCurrencyBid = dailys[dailysDays[0]]["2. high"]

        setSecondCurrencyValue(Number((firstCurrencyValue * lastCurrencyBid).toFixed(2)))
        setBidCurrency(lastCurrencyBid)


    }

    useEffect(() => {
        if (!fromCurrencySymbol || !toCurrencySymbol) {
            return
        }

        if (fromCurrencySymbol === toCurrencySymbol) {
            return setBidCurrency(1)
        }

        fetchBidCurrency();
    }, [fromCurrencySymbol, toCurrencySymbol])


    return (
        <div className={styles.container}>

            <h1>Conversor de moedas</h1>

            <div className={styles.inputsContainer}>

                <div className={styles.currencyInput}>
                    <input
                        placeholder='$'
                        type="text"
                        id="first"
                        value={stringNumberWithCommas(firstCurrencyValue)}
                        onInput={handleChangeInput}
                    />

                    <div className={styles.selectContainer}>
                        <select
                            onChange={(event) => { setFromCurrencySymbol(event.target.value) }}
                        >
                            {
                                currencies.map(currency => {
                                    return (
                                        <option
                                            key={currency.symbol}
                                            value={currency.symbol}
                                        >
                                            {currency.symbol} - {currency.name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>

                <Image
                    src="/currencyIcon.svg"
                    alt="Icone com setas para os dois lados, indicando conversão"
                    width={24}
                    height={24}
                />

                <div className={styles.currencyInput}>
                    <input
                        placeholder='$'
                        type="text"
                        id="second"
                        value={stringNumberWithCommas(secondCurrencyValue)}
                        onInput={handleChangeInput}
                    />
                    <div className={styles.selectContainer}>

                        <select
                            onChange={(event) => { setToCurrencySymbol(event.target.value) }}
                            id='second-currency'
                        >
                            {
                                currencies.map(currency => {
                                    return (
                                        <option
                                            key={currency.symbol}
                                            value={currency.symbol}
                                        >
                                            {currency.symbol} - {currency.name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}