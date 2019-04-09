var gameArea =
{
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    12.5443696975708,
                    55.77403860244846
                ],
                [
                    12.555184364318848,
                    55.77198681146434
                ],
                [
                    12.557587623596191,
                    55.77804531812104
                ],
                [
                    12.547845840454102,
                    55.77995198393113
                ],
                [
                    12.5443696975708,
                    55.77403860244846
                ]
            ]
        ]
    }
}

const players = [
    {
        "type": "Feature",
        "properties": {"name": "Kurt"},
        "geometry": {
            "type": "Point",
            "coordinates": [
                12.558274269104004,
                55.775245487869014
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {"name": "Bob"},
        "geometry": {
            "type": "Point",
            "coordinates": [
                12.545185089111328,
                55.777707418246386
            ]
        }
    }
]

module.exports = {
    gameArea,
    players
}