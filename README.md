# shell-test
Star Ship Tracking API!

FYI I haven't quite started yet but I will get this in the next hour or two.

This readme will be updated as I work, initial notes based on the spec provided. Will let you guys know when done.

# Initial notes

POST /arrival
```
{
"vessel": "El Tauro",
"datetime": "5th of Feb 2056",
"port": "Singapore",
"captain": "Patsy Stone"
}
```

Vessel - needs validation, do we have a vessel with that name.

datetime - Datetime format needs to convert to timestamp.

port - needs validation that the port exists

captain - needs validation that the captain exists

GET /history/patsy+stone
```
{
"captainName": "Patsy Stone",
"trips": [
    {
        "vessel": "El Tauro",
        "from": "Singapore",
        "to": "Melbourn",
        "fromDate": 123123213,
        "toDate": 23423434
    }
  ]
}
```

Validate captain exists.
Sort array of objects in chronological order latest to oldest.

# Genernal architecture notes.

Lambda based API.

Endpoint validation in Joi

Logging to ElasticSearch

Error reporting via Sentry.

Voyage storage in MySQL or Dynamo - possible preference to MySQL as it'll allow better sorting during a query(maybe)

Port, captain and vessel name validation done in static arrays held in config, would obviously be moved out to tables for production usage.

Dev and offline available via sls offline but pointing at Dev aws infrastructure configured for env vars.

Mocks queried by using X-MOCK-HEADER.

API configuration will be created from swagger definition and imported via a gulp task.

Testing available via mocha/chai?

