import { makeStyles, useMediaQuery } from "@material-ui/core"
import { useEffect } from "react"
import { useRef } from "react"
import { createChart } from "lightweight-charts"
import { formaterNumber } from "../../../helpers/helpers"
import { ResizeObserver } from "resize-observer"

const useStyles = makeStyles((theme) => {
	return {
		chartContainer: {
			position: "relative",
			height: "100%",
			width: "100%",
		},
		chart: {
			position: "absolute",
			top: "0",
			right: "0",
			bottom: "0",
			left: "0",
			height: "100%",
			width: "100%",
		},
	}
})

const ChartVolume = ({ data, crossMove, onMouseLeave, onClick, range }) => {
	const classes = useStyles()
	const chartRef = useRef(null)
	const containerRef = useRef(null)
	const serieRef = useRef(null)
	const resizeObserver = useRef(null)
	const matchXS = useMediaQuery((theme) => theme.breakpoints.down("xs"))

	const setPeriode = (data, chartRef) => {
		if (data.length > 0) {
			chartRef.current.timeScale().setVisibleRange({
				from: data[data.length - 290].time,
				to: data[data.length - 1].time,
			})
		}
	}

	useEffect(() => {
		resizeObserver.current = new ResizeObserver((entries, b) => {
			const { width, height } = entries[0].contentRect
			chartRef.current.applyOptions({ width, height })
			setTimeout(() => {
				// chartRef.current.timeScale().fitContent()
				setPeriode(data, chartRef)
			}, 0)
		})
		resizeObserver.current.observe(containerRef.current, {
			box: "content-box",
		})
		return () => {
			resizeObserver.current.disconnect()
		}
	}, [matchXS])

	useEffect(() => {
		// Initialization
		if (chartRef.current === null) {
			let chart = createChart(containerRef.current, {
				layout: {
					backgroundColor: "rgba(31, 33, 40,0)",
					textColor: "#c3c5cb",
					fontFamily: "'Inter'",
				},
				rightPriceScale: {
					scaleMargins: {
						top: 0.1,
						bottom: 0,
					},
				},
				localization: {
					priceFormatter: (price) => {
						return formaterNumber(price)
					},
				},
				grid: {
					horzLines: {
						visible: false,
					},
					vertLines: {
						visible: false,
					},
				},
				crosshair: {
					horzLine: {
						visible: false,
						labelVisible: false,
					},
					vertLine: {
						visible: true,
						style: 0,
						width: 2,
						color: "rgba(32, 38, 46, 0.1)",
						labelVisible: false,
					},
				},
				timeScale: {
					rightOffset: 1,
					barSpacing: 28,
					lockVisibleTimeRangeOnResize: true,
				},
			})

			serieRef.current = chart.addHistogramSeries({
				color: "rgba(251, 192, 45, 0.9)",
			})

			chartRef.current = chart
		}
		const hover = (event) => {
			let item = { time: event.time, value: event.seriesPrices.get(serieRef.current) }
			crossMove(item)
		}
		chartRef.current.subscribeCrosshairMove(hover)
		chartRef.current.subscribeClick(onClick)
		return () => {
			chartRef.current.unsubscribeCrosshairMove(hover)
			chartRef.current.unsubscribeClick(onClick)
		}
	}, [crossMove])

	useEffect(() => {
		// When data is updated
		if (data.length > 0) {
			let maxLimit = 250_000_000 // range -> d
			if (range === "w") {
				maxLimit = 1_000_000_000 // range -> w
			} else if (range === "m") {
				maxLimit = 3_500_000_000 // range -> m
			}
			let min = data.reduce((pr, cv) => {
				if (pr < cv.value) {
					return pr
				} else {
					return cv.value
				}
			}, data[0].value)

			let max = data.reduce((pr, cv) => {
				if (pr > cv.value) {
					return pr
				} else {
					if (cv.value > maxLimit) {
						return maxLimit
					} else {
						return cv.value
					}
				}
			}, data[0].value)

			serieRef.current.applyOptions({
				autoscaleInfoProvider: () => ({
					priceRange: {
						minValue: min,
						maxValue: max,
					},
				}),
			})

			serieRef.current.setData(data)
			// chartRef.current.timeScale().fitContent()
			setPeriode(data, chartRef)
		}
	}, [data, range])

	return (
		<div className={classes.chartContainer}>
			<div onMouseLeave={onMouseLeave} className={classes.chart} ref={containerRef}></div>
		</div>
	)
}

export default ChartVolume
