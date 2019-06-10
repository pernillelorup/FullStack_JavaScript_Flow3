# FullStackJavaScript Flow 3

## Period-3 Geo-data, GeoJSON, Geospatial Queries with MongoDB, React Native/Expo’s Location and MapView Components
### https://github.com/grem848/mini-project-fullstackjs2019


# Detailed Questions

>## Explain and demonstrate basic Geo-JSON, involving as a minimum, Points and Polygons

## Points
https://github.com/grem848/mini-project-fullstackjs2019/blob/master/makeData.js
```js
    // add positions to 3 test users above
    var kurt = await userFacade.findByUsername("ckw");
    var jane = await userFacade.findByUsername("cjw");
    var bo = await userFacade.findByUsername("cbw");

    console.log("Add positions to jane, bo and a")
    var positions = [
      positionCreator(12.51293635, 55.77066395, jane._id, true),
      positionCreator(12.53932071, 55.76679288, bo._id, true),
      positionCreator(12.544750, 55.775508, kurt._id, true)
    ]
    console.log(`${kurt.firstName}'s ID: ${kurt._id}`);
    console.log(`${jane.firstName}'s ID: ${jane._id}`);
    console.log(`${bo.firstName}'s ID: ${bo._id}`);
    await Position.insertMany(positions);

```
## Polygons
https://github.com/grem848/mini-project-fullstackjs2019/blob/master/makeData.js
```js
    console.log("Create Area")
    const polygon = {
      type: "Polygon",
      name: "TestArea",
      coordinates: [
        [
          [12.541322708129883, 55.77415929267225],
          [12.577714920043945, 55.7767661102896],
          [12.576856613159178, 55.78038640106636],
          [12.58277893066406, 55.78231708529588],
          [12.581834793090819, 55.78661251449472],
          [12.578573226928711, 55.788784180465655],
          [12.576513290405273, 55.79433344350657],
          [12.569818496704102, 55.795732698062174],
          [12.541322708129883, 55.77415929267225]
        ]
      ]
    };
    const area = await new Area(polygon).save();
    console.log("Saved an area: ", area);
```

## Basics
https://github.com/grem848/mini-project-fullstackjs2019/blob/master/facades/queryFacade.js
```js
// get distance to friend
const User = require('../models/User');
const Position = require('../models/Position');
const Area = require('../models/Area');
const gju = require('geojson-utils');

async function getDistanceToUser(lon, lat, username) {
	const user_id = await User.findOne({ userName: username }).select({ _id: 1 });
	if (user_id !== null) {
		return (userPos = await Position.findOne({ user: user_id })
			.catch(() => {
				throw new Error(`${username} doesn't have a Location`);
			})
			.then(async (data) => {
				if (data === null) {
					throw new Error(`${username} doesn't have a Location`);
				} else {
					const point = { type: 'Point', coordinates: [ lon, lat ] };
					const distance = await gju.pointDistance(point, data.loc); // finds distance in meters between Point and User
					return { username: username, distance };
				}
			}));
	} else {
		throw new Error(`User: ${username} doesn't Exist`);
	}
}

async function findNearbyPlayers(lon, lat, dist) {
	return Position.find({
		loc: {
			$near: {
				$geometry: { type: 'Point', coordinates: [ lon, lat ] },
				$minDistance: 0.1,
				$maxDistance: dist
			}
		}
	})
		.populate('user', 'userName firstName') // you can add more variables if you like
		.select({ created: 0, __v: 0, _id: 0, 'loc.type': 0, 'user._id': 0 });
}

async function isUserinArea(areaName, username) {
	const area = await Area.findOne({ name: areaName });
	if (area === null) {
		throw new Error('Area Not Found');
	}
	const user_id = await User.findOne({ userName: username }).select({ _id: 1 });
	if (user_id !== null) {
		const userPos = await Position.findOne({
			user: user_id,
			loc: {
				$geoWithin: {
					$geometry: area
				}
			}
		}).catch(() => {
			throw new Error(`${username} doesn't have a Location`);
		});
		var status = false;
		var msg = 'Point was NOT inside tested polygon';
		if (userPos !== null) {
			status = true;
			msg = 'Point was inside the tested polygon';
		}
		return { status, msg };
	} else {
		throw new Error(`User: ${username} doesn't Exist`);
	}
}

module.exports = {
	getDistanceToUser,
	findNearbyPlayers,
	isUserinArea
};
```

>## Explain and demonstrate ways to create Geo-JSON test data

>## Explain the typical order of longitude and latitude used by Server Side API’s and Client Side API’s

>## Explain and demonstrate a REST API that implements geo-features, using a relevant geo-library and plain JavaScript

>## Explain and demonstrate a REST API that implements geo-features, using Mongodb’s geospatial queries and indexes.

>## Explain and demonstrate a React Native Client that uses geo-components (Location, MapView, etc.)

>## Demonstrate both server and client-side, of the geo-related parts of your implementation of the mini project
