export default (trips) => {

    // so we work our way down the list of trips pairing each trip, so the first one is where they started,
    // second one is where they finished up. We only count pairs of journeys.

	let parsedResults = []

	for (let index = 0; index < trips.length; index += 2) {
		let trip1 = trips[index]
		let trip2 = trips[index + 1]

		if (!trip2) {
			break
		}

		trips[index].fromDate = trip1.datetime
		trips[index].toDate = trip2.datetime

		parsedResults.push(trips.slice(index, index + 1))

	}

	return parsedResults
}
