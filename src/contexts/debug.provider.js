import { createContext, useContext, useEffect, useState } from "react"
const DebugContext = createContext()

const MODE = process.env.REACT_APP_MODE

export const useDebug = () => useContext(DebugContext)

export const DebugProvider = ({ children }) => {
	const [open, setOpen] = useState(false)
	const onClose = () => setOpen(false)
	const [isAccumulated, setIsAccumulated] = useState(true)

	return (
		<DebugContext.Provider value={{ open, onClose, MODE, setOpen, isAccumulated, setIsAccumulated }}>
			{children}
		</DebugContext.Provider>
	)
}
