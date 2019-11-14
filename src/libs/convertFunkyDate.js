export default (funkyDate) => {
  // TODO: this is a bit of a hack for the purposes of the test!

	const numberPattern = /\d+/g
	const numbers = funkyDate.match(numberPattern)
	const words = funkyDate.split(' ')

    // if it's not in the expected format.
	if (words.length !== 4) {
        // We return false so that the handler can return bad request.
		return false
	}

    // if we can't get day and year.
	if (numbers.length !== 2) {
		return false
	}

    // Now we just need to grab the Month:
    // TODO: move to config
	const months = ['Jan', 'Feb', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const month = words.filter(e => months.indexOf(e) !== -1)
	const numericalMonth = months.indexOf(month[0]) + 1
	console.log(`${numbers[1]}.${numericalMonth}.${numbers[0]}`)
	const timestamp = (new Date(`${numbers[1]}.${numericalMonth}.${numbers[0]}`).getTime() / 1000).toFixed(0)
	console.log('TCL: timestamp', timestamp)

	return timestamp
}
