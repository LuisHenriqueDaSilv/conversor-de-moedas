import './globals.css'

export const metadata = {
	title: {
		default: 'Conversor de moedas | #BoraCodar(9)',
		template: '%s | #BoraCodar(9)'
	},
	description: 'Conversor de moedas desenvolvido para o #BoraCodar(9)',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-br">
			<body>{children}</body>
		</html>
	)
}
