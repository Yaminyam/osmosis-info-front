import { Button, makeStyles } from "@material-ui/core"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import LogoutIcon from "@mui/icons-material/Logout"
import { useKeplr } from "../../contexts/KeplrProvider"
import { useToast } from "../../contexts/Toast.provider"
import useSize from "../../hooks/sizeHook"

const useStyles = makeStyles((theme) => {
	return {
		rootButtonConnection: {
			marginLeft: "16px",
			backgroundColor: "#322DC2",
			color: theme.palette.primary.contrastText,
			"&:hover": {
				backgroundColor: "#4642C8",
			},
		},
		rootButtonDisconnect: {
			marginLeft: "16px",
			borderColor: theme.palette.yellow.gold,
			color: theme.palette.yellow.gold,
			"&:hover": {},
		},
	}
})

const ButtonConnection = ({ tooBig }) => {
	const classes = useStyles()
	const { showToast } = useToast()
	const { keplrStatus, connect, disconnect, address, name } = useKeplr()
	const size = useSize()

	const onClick = async () => {
		if (keplrStatus === "uninstalled") {
			showToast({ text: "Keplr is not installed", severity: "warning" })
		} else {
			try {
				connect()
			} catch (e) {
				showToast({ text: "An error has occurred", severity: "error" })
				console.log("button_connection.jsx -> 39: ", e)
			}
		}
	}
	if (address && address.length > 0) {
		return (
			<Button
				variant="outlined"
				onClick={disconnect}
				className={classes.rootButtonDisconnect}
				startIcon={<LogoutIcon />}
			>
				{!tooBig ? `${name} - ` : null}
				Log out
			</Button>
		)
	} else {
		return (
			<Button
				variant="contained"
				onClick={onClick}
				className={classes.rootButtonConnection}
				startIcon={<AccountBalanceWalletIcon />}
			>
				Connect
			</Button>
		)
	}
}

export default ButtonConnection
