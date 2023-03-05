import { createContext, ReactNode, useEffect, useState} from 'react'

interface CurrenciesContextData {
    handleChangeCurrencyInput: (event:React.ChangeEvent<HTMLInputElement>) => void,
    firstCurrencyValue: number,
    secondCurrencyValue: number,
    setToCurrencySymbol: (symbol:string) => void
    setFromCurrencySymbol: (symbol:string) => void,
}


export const CurrenciesContext = createContext({} as CurrenciesContextData)

export function CurrenciesProvider({children}: {children: ReactNode}){

    const [bidCurrency, setBidCurrency] = useState<number>(1)

    const [firstCurrencyValue, setFirstCurrencyValue] = useState(1)
    const [secondCurrencyValue, setSecondCurrencyValue] = useState(1)

    const [fromCurrencySymbol, setFromCurrencySymbol] = useState<string>('AED')
    const [toCurrencySymbol, setToCurrencySymbol] = useState<string>('AED')

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
           `https://economia.awesomeapi.com.br/json/daily/${fromCurrencySymbol}-${toCurrencySymbol}/30`
        )

        const responseData = await response.json()

        if(responseData.code === 'CoinNotExists'){
            alert('Conversão não disponivel! Escolha outro par de moedas.')
        } else {
            const currentBid = responseData[0].bid
            setBidCurrency(currentBid)
            setSecondCurrencyValue(Number((firstCurrencyValue * currentBid).toFixed(2)))
        }

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
            }}
        >
            {children}
        </CurrenciesContext.Provider>
    )
}