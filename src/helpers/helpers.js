import typesDashboard from "./typesDashboard.json"

export const formatTokenName = (tokenName) => {
	let res = ""
	if (tokenName) res = tokenName.replace("axl", "")
	return res
}

export const getTypeDashboard = (type, reverse = false) => {
	let res = type
	if (reverse) {
		let finded = Object.keys(typesDashboard).find((key) => typesDashboard[key] === type)
		res = finded ? finded : type
	} else {
		let finded = typesDashboard[type]
		res = finded ? finded : type
	}
	if (!res) res = type
	return res
}

export const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate()

export const formateNumberPrice = (price) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price)
}

export const formateNumber = (price) => {
	return new Intl.NumberFormat("en-US", {
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price)
}

export const formatDate = (date) => {
	let options = { month: "short", day: "numeric", year: "numeric" }
	return new Intl.DateTimeFormat("en-US", options).format(date)
}

export const formatDateHours = (date) => {
	let options = { month: "short" }
	let month = new Intl.DateTimeFormat("en-US", options).format(date)
	let year = date.getUTCFullYear()
	let day = date.getUTCDate()
	let hour = date.getUTCHours()
	let mer = "am"
	if (hour > 12) {
		hour = hour - 12
		mer = "pm"
	}
	return `${month} ${day}, ${year}, ${hour}:00 ${mer}`
}

export const detectBestDecimalsDisplay = (price, minDecimal = 2, minPrice = 1, maxDecimal) => {
	if (price && price > minPrice) return minDecimal
	let decimals = minDecimal
	if (price !== undefined) {
		// Find out the number of leading floating zeros via regex
		const priceSplit = price.toString().split(".")
		if (priceSplit.length === 2 && priceSplit[0] === "0") {
			const leadingZeros = priceSplit[1].match(/^0+/)
			decimals += leadingZeros ? leadingZeros[0].length + 1 : 1
		}
	}
	if (maxDecimal && decimals > maxDecimal) decimals = maxDecimal
	return decimals
}

export const formateNumberPriceDecimals = (price, decimals = 2) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: decimals,
	}).format(price)
}

export const getPercent = (value, unit = true) => {
	let res = parseFloat(
		formateNumberDecimalsAuto({ price: value, minDecimal: 2, minPrice: 1, maxDecimal: 2 }).replace(",", "")
	).toFixed(2)
	if (unit) {
		return res + "%"
	}
	return res
}

export const formateNumberDecimalsAuto = ({ price, maxDecimal, unit, minDecimal, minPrice }) => {
	minDecimal = minDecimal ? minDecimal : 2
	minPrice = minPrice ? minPrice : 1
	let res =
		formateNumberDecimals(price, detectBestDecimalsDisplay(price, minDecimal, minPrice, maxDecimal)) +
		(unit ? unit : "")
	return res
}

export const formatPercent = (price) => {
	return formateNumberDecimalsAuto({ price, minDecimal: 0, minPrice: 1, maxDecimal: 2, unit: "%" })
}

export const formateNumberDecimals = (price, decimals = 2) => {
	return new Intl.NumberFormat("en-US", {
		currency: "USD",
		maximumFractionDigits: decimals,
	}).format(price)
}

export const formaterNumber = (num) => {
	if (Math.abs(num) < 1_000) {
		return formateNumberDecimalsAuto({ price: num }) // if value < 1000, nothing to do
	} else if (Math.abs(num) < 1_000_000) {
		return parseFloat((num / 1000).toFixed(1)) + "K" // convert to K for number from > 1000 < 1 million
	} else if (Math.abs(num) < 1_000_000_000) {
		return parseFloat((num / 1_000_000).toFixed(1)) + "M" // convert to M for number from > 1 million
	} else {
		return parseFloat((num / 1_000_000_000).toFixed(1)) + "B" // convert to M for number from > 1 billion
	}
}

export const getInclude = (list, condition) => {
	let i = 0
	while (i < list.length) {
		if (condition(list[i])) return i
		i++
	}
	return -1
}

export const isOsmoAddress = (str) => {
	let regexOsmo = /^osmo[a-z0-9]{39,39}/
	return regexOsmo.test(str)
}

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export const getItemInclude = (list, condition) => {
	let i = 0
	while (i < list.length) {
		if (condition(list[i])) return list[i]
		i++
	}
	return null
}

export const float2Numbers = (num) => Math.round(num * 100) / 100

export const twoNumber = (num) => {
	num = num + ""
	return num.length === 1 ? "0" + num : num
}

export const normalize = (string) => {
	if (string) {
		return string
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
	} else {
		return ""
	}
}

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const getWeekNumber = (date) => {
	let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	let dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

export const getDates = (startDate, range) => {
	if (range === "m") {
		// let firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
		let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
		return [startDate, lastDay]
	}
	if (range === "w") {
		let first = startDate.getDate() - startDate.getDay()
		let last = first + 6

		let firstday = new Date(startDate.setDate(first))
		let lastday = new Date(firstday.setDate(last))
		return [startDate, lastday]
	}
}

export const isValidDate = (d) => {
	return d instanceof Date && !isNaN(d)
}

export const timeToDate = (time) => {
	switch (typeof time) {
		case "string":
			return new Date(time)
		case "number":
			return new Date(time * 1_000)
		case "object":
			return new Date(`${twoNumber(time.year)}/${twoNumber(time.month)}/${twoNumber(time.day)}`)
		default:
			return new Date(time)
	}
}

export const timeToDateUTC = (time) => {
	switch (typeof time) {
		case "string":
			let split = time.split("-")
			return new Date(Date.UTC(split[0], parseInt(split[1]) - 1, split[2]))
		case "number":
			return new Date(Date.UTC(time * 1_000))
		case "object":
			return new Date(Date.UTC(time.year, time.month - 1, time.day))
		default:
			return new Date(Date.UTC(time))
	}
}
