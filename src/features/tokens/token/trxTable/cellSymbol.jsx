import { makeStyles, TableCell } from "@material-ui/core"
import { formateNumberDecimalsAuto } from "../../../../helpers/helpers"
const useStyles = makeStyles((theme) => {
	return {
		rootCellSymbol: {
			textAlign: "right",
			width: "140px",
			overflow: "hidden",
			textOverflow: "ellipsis",
		},
		firstNumber: {
			fontSize: "14px",
		},
		restNumber: {
			fontSize: "13px",
		},
		symbol: {
			paddingLeft: "5px",
			// color: theme.palette.table.cellDark,
			fontSize: "15px",
		},
		cellSell: {
			color: `${theme.palette.error.main} !important`,
		},
		cellBuy: {
			color: `${theme.palette.green.text} !important`,
		},
	}
})
const CellSymbol = ({ cellKey, cellConfig, data }) => {
	const classes = useStyles()
	let currentData = data[cellConfig.cellKey]
	if (!currentData && !currentData.value) return <TableCell key={cellKey}>-</TableCell>
	let splitNumber = formateNumberDecimalsAuto({ price: currentData.value }).toString().split(".")
	let classesName = classes.rootCellSymbol
	if (data.type === "Sell") {
		classesName += ` ${classes.cellSell}`
	} else {
		classesName += ` ${classes.cellBuy}`
	}
	return (
		<TableCell key={cellKey}>
			<div className={classesName}>
				<span className={classes.firstNumber}>{splitNumber[0]}</span>
				{splitNumber.length > 1 ? <span className={classes.restNumber}>.{splitNumber[1]}</span> : null}
				<span className={classes.symbol}>{currentData.symbolDisplay}</span>
			</div>
		</TableCell>
	)
}

export default CellSymbol
