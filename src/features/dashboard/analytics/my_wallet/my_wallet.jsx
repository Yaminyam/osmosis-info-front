import { makeStyles } from "@material-ui/core"
import { useEffect, useState } from "react"
import BlocLoaderOsmosis from "../../../../components/loader/BlocLoaderOsmosis"
import Paper from "../../../../components/paper/Paper"
import { useKeplr } from "../../../../contexts/KeplrProvider"
import { useBalance } from "../../../../hooks/data/dashboard.hook"
import WalletHeader from "./wallet_header"
import WalletItem from "./wallet_item"
const useStyles = makeStyles((theme) => {
	return {
		rootMyWallet: {
			width: "100%",
			margin: "20px 0",

			[theme.breakpoints.down("xs")]: {},
		},
		title: {
			fontSize: "1.4rem",
			color: theme.palette.gray.contrastText,
			marginBottom: "20px",
		},
		loading: {
			backgroundColor: theme.palette.primary.light,
		},
		loading: {
			backgroundColor: theme.palette.primary.light,
		},
		paper: {
			position: "relative",
			height: "350px",
			overflow: "hidden",
		},
		list: {
			overflowY: "auto",
			maxHeight: "92%",
		},
	}
})
const MyWallet = () => {
	const classes = useStyles()
	const { address } = useKeplr()

	//Balance
	const { data: balance, isLoading } = useBalance( { address })

	const [data, setData] = useState([])
	const [order, setOrder] = useState("asc")
	const [orderBy, setOrderBy] = useState("value")

	const onSort = (name) => {
		let newOrder = order === "desc" ? "asc" : "desc"
		setOrder(newOrder)
		setOrderBy(name)
	}

	useEffect(() => {
		if (balance) {
			let data = []
			if (balance.wallet) data = balance.wallet
			setData(data)
		}
	}, [balance])

	const displayData = (data) => {
		return [...data].sort((a, b) => {
			let res = b[orderBy] - a[orderBy]
			return order === "desc" ? -res : res
		})
	}

	return (
		<div className={classes.rootMyWallet}>
			<p className={classes.title}>My Wallet</p>
			<Paper className={classes.paper}>
				<BlocLoaderOsmosis open={isLoading} classNameLoading={classes.loading} />
				<WalletHeader onSort={onSort} order={order} orderBy={orderBy} />
				<div className={classes.list}>
					{data.length === 0 ? <p>No item found</p> : null}
					{displayData(data).map((item, index) => {
						return <WalletItem key={item.denom} data={item} />
					})}
				</div>
			</Paper>
		</div>
	)
}

export default MyWallet
