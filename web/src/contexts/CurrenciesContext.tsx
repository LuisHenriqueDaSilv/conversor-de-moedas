import { createContext, ReactNode, useEffect, useState } from 'react'

interface CurrencyHistory {
    labels: string[],
    datasets: [
        {
            label: string,
            data: number[],
            borderColor: 'rgba(124, 58, 237, 1)',
            backgroundColor: 'rgba(124, 58, 237, 1)',
        },
    ],
}

interface CurrenciesContextData {
    handleChangeCurrencyInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
    firstCurrencyValue: number,
    secondCurrencyValue: number,
    setToCurrencySymbol: (symbol: string) => void
    setFromCurrencySymbol: (symbol: string) => void,
    currencyHistory: CurrencyHistory | null
}

interface CurrencyHistoryModule {
    high: number,
    low: number,
    varBid: number,
    pctChange: number,
    bid: number,
    ask: number,
    timestamp: number
}


export const CurrenciesContext = createContext({} as CurrenciesContextData)

export function CurrenciesProvider({ children }: { children: ReactNode }) {

    const [bidCurrency, setBidCurrency] = useState<number>(1)

    const [firstCurrencyValue, setFirstCurrencyValue] = useState(1)
    const [secondCurrencyValue, setSecondCurrencyValue] = useState(1)

    const [fromCurrencySymbol, setFromCurrencySymbol] = useState<string>('AED')
    const [toCurrencySymbol, setToCurrencySymbol] = useState<string>('AED')

    const [currencyHistory, setCurrencyHistory] = useState<CurrencyHistory | null>(null)


    function handleChangeCurrencyInput(event: React.ChangeEvent<HTMLInputElement>) {
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

        const response = await fetch(
            `https://economia.awesomeapi.com.br/json/daily/${fromCurrencySymbol}-${toCurrencySymbol}/30`,
            {
                cache: 'force-cache'
            }
        )

        const responseData = await response.json() as CurrencyHistoryModule[]

        if (responseData.code === 'CoinNotExists') {
            alert('Conversão não disponivel! Escolha outro par de moedas.')
            setCurrencyHistory(null)
            setFirstCurrencyValue(1)
            setSecondCurrencyValue(1)
            setBidCurrency(1)
            return
        }

        const currentBid = responseData[0].bid
        setBidCurrency(currentBid)
        setSecondCurrencyValue(Number((firstCurrencyValue * currentBid).toFixed(2)))

        const valuesData = [] as number[]
        const labels = [] as string[]

        responseData.forEach((historyModule) => {
            const date = new Date(Number(historyModule.timestamp))
            console.log(date.getDate())
            labels.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear())
            valuesData.push(historyModule.bid)
        })


        setCurrencyHistory({
            labels,
            datasets: [{
                data: valuesData,
                label: `${fromCurrencySymbol}->${toCurrencySymbol}`,
                borderColor: 'rgba(124, 58, 237, 1)',
                backgroundColor: 'rgba(124, 58, 237, 1)',
            }]
        })

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
        <CurrenciesContext.Provider
            value={{
                handleChangeCurrencyInput,
                firstCurrencyValue,
                secondCurrencyValue,
                setFromCurrencySymbol,
                setToCurrencySymbol,
                currencyHistory
            }}
        >
            {children}
        </CurrenciesContext.Provider>
    )
}