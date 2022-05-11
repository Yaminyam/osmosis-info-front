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
			color: theme.palette.table.cellDark,
			fontSize: "15px",
		},
	}
})
const CellSymbol = ({ cellKey, cellConfig, data }) => {
	const classes = useStyles()
	let currentData = data[cellConfig.cellKey]
	if (!currentData && !currentData.value) return <TableCell key={cellKey}>-</TableCell>
	let splitNumber = formateNumberDecimalsAuto({ price: currentData.value }).toString().split(".")

	const onClick = () => {
		cellConfig.onClickCell(data)
	}
	return (
		<TableCell key={cellKey} className={classes.rootCellSymbol} onClick={cellConfig.onClickCell?onClick:null}>
			<div className={classes.rootCellSymbol}>
				<span className={classes.firstNumber}>{splitNumber[0]}</span>
				{splitNumber.length > 1 ? <span className={classes.restNumber}>.{splitNumber[1]}</span> : null}
				<span className={classes.symbol}>{currentData.symbolDisplay}</span>
			</div>
		</TableCell>
	)
}

export default CellSymbol
