"use client"

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);


interface LineChartParams {
	data: {
		labels: string[],
		datasets: {
			label: string,
			data: number[]
			borderColor: any,
			backgroundColor: any,
		}[]
	},
}

export function LineChart({ data }: LineChartParams) {
	return <Line
		data={data}
		options={{
			animation: false,
			maintainAspectRatio: false
		}}
	/>
}