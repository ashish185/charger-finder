**As a operator I want to create stations and I want to add the charger**

**Database structure in their collections**

- stations

```js
{
  _id: ObjectId('6a8059124795ed4ab64947c3'),
  operator_id: ObjectId('6a8059124795ed4ab64947c2'),
  name: 'GreenVolt - Andheri West',
  address: 'Link Road, Andheri West, Mumbai, MH 400058',
  location: {
    type: 'Point',
    coordinates: [
      Double('72.8296'),
      Double('19.1358')
    ]
  },
  amenities: [
    'Parking',
    'Restroom',
    'Cafe'
  ],
  operating_hours: '06:00-23:00',
  occupancy: [
    'two_wheeler_scooter',
    'four_wheeler_hatchback'
  ],
  status: 'open'
}
```

- chargers

```js
{
  _id: ObjectId('6a8059124795ed4ab64947c6'),
  station_id: ObjectId('6a8059124795ed4ab64947c3'),
  connector_type: 'CCS2',
  charging_type: 'DC',
  connector: 'CCS2',
  max_power_kw: NumberInt('50'),
  status: 'IN_USE',
  price_per_kwh: NumberInt('22'),
  last_updated_at: ISODate('2026-08-05T07:45:00.000Z'),
  last_updated_source: 'CPO_PORTAL',
  fault_flag: false,
  availability_slots: [
    {
      _id: ObjectId('6a8059124795ed4ab64947cb'),
      start: ISODate('2026-08-05T07:45:00.000Z'),
      end: ISODate('2026-08-05T08:30:00.000Z'),
      status: 'BOOKED',
      order_id: null
    },
    {
      _id: ObjectId('6a8059124795ed4ab64947cc'),
      start: ISODate('2026-08-05T08:30:00.000Z'),
      end: ISODate('2026-08-05T09:00:00.000Z'),
      status: 'AVAILABLE',
      order_id: null
    }
  ]
}
```

**Fix routes and associated code**

- C:\Projects\charger-finder\src\routes\cpo-stations.js
