# FullStackJavaScript Flow 3

## Period-3 Geo-data, GeoJSON, Geospatial Queries with MongoDB, React Native/Expo’s Location and MapView Components
### https://github.com/grem848/mini-project-fullstackjs2019
### https://github.com/pernillelorup/mini-project-native-app


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
<br>

>## Explain and demonstrate ways to create Geo-JSON test data

### Create new features and use them (fast way)
https://github.com/grem848/mini-project-fullstackjs2019/blob/master/makeData.js

### Testing as it should be
https://github.com/grem848/mini-project-fullstackjs2019/tree/master/test

<br>

>## Explain the typical order of longitude and latitude used by Server Side API’s and Client Side API’s

<img src="https://www.ecsecc.org/assets/0/images/LatLong.png" width="500">

**There is no order for longitude,latitude**

HOWEVER!
In mathematical functions x,y are used, for the geographic coordinate system we use lon,lat or inverse.
The x-axis relates to longitude and y to latitude and the x,y order is ususally prefered.



From (old) navigation and geography latitude and longitude was used.
To figure out your latitude, you just needed (a) the calendar date, and (b) some astronomical measurements (like for instance, the angle of the sun above the horizon at its highest point on a given day as measured from your ship).

To figure out your longitude, you would need a precise clock tracking time from some reference point.

This has made the standard for many services to latitude, longitude.

<br>

>## Explain and demonstrate a REST API that implements geo-features, using a relevant geo-library and plain JavaScript

### Rest endpoint that takes a position and measures distance a user
```js
/* GET distance to user from username and coordinates */
router.get('/distanceToUser/:lon/:lat/:username', async function(req, res, next) {
	var { lon, lat, username } = req.params;
	var obj = await queryFacade.getDistanceToUser(lon, lat, username).catch((err) => {
		res.status(404).json({ msg: err.message });
	});
	if (obj !== undefined) {
		res.status(200).json({ distance: obj.distance, to: obj.username });
	}
});
```
### getDistanceToUser method
```js
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
```

<br>

>## Explain and demonstrate a REST API that implements geo-features, using Mongodb’s geospatial queries and indexes.

Geospatial Query Operators
MongoDB provides the following geospatial query operators:

Name	Description
* $geoIntersects
	* Selects geometries that intersect with a GeoJSON geometry. The 2dsphere index supports $geoIntersects.

* $geoWithin
	* Selects geometries within a bounding GeoJSON geometry. The 2dsphere and 2d indexes support $geoWithin.

* $near	
	* Returns geospatial objects in proximity to a point. Requires a geospatial index. The 2dsphere and 2d indexes support $near.

* $nearSphere
	* Returns geospatial objects in proximity to a point on a sphere. Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.

<br>

>## Explain and demonstrate a React Native Client that uses geo-components (Location, MapView, etc.)

https://github.com/pernillelorup/mini-project-native-app
https://expo.io/@grem848/mini-project-app-2019

<br>

>## Demonstrate both server and client-side, of the geo-related parts of your implementation of the mini project

<br>
