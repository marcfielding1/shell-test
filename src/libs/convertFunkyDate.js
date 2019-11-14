/*
As per my comments on my documentation there's got to be a better way of doing this
I'd be asking colleagues/team members(three amigos or whatever) for some ideas around this.
*/

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

	// if we can't get day and year. This is bad juju because we could be getting "1 2 Buckle my shoe" - but we're assuming the
	// external API is following the same format as in the example.
	if (numbers.length !== 2) {
		return false
	}

    // Now we just need to grab the Month:
    // TODO: move to config
	const months = ['Jan', 'Feb', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const month = words.filter(e => months.indexOf(e) !== -1)
	const numericalMonth = months.indexOf(month[0]) + 1
	const timestamp = (new Date(`${numbers[1]}.${numericalMonth}.${numbers[0]}`).getTime() / 1000).toFixed(0)

	return timestamp
}
