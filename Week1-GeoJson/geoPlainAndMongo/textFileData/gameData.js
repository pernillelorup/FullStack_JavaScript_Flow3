const gameArea = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          12.541322708129883,
          55.77415929267225
        ],
        [
          12.577714920043945,
          55.7767661102896
        ],
        [
          12.576856613159178,
          55.78038640106636
        ],
        [
          12.58277893066406,
          55.78231708529588
        ],
        [
          12.581834793090819,
          55.78661251449472
        ],
        [
          12.578573226928711,
          55.788784180465655
        ],
        [
          12.576513290405273,
          55.79433344350657
        ],
        [
          12.569818496704102,
          55.795732698062174
        ],
        [
          12.541322708129883,
          55.77415929267225
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
        12.549648284912108,
        55.786081644399324
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {"name": "Peter"},
    "geometry": {
      "type": "Point",
      "coordinates": [
        12.561063766479492,
        55.79235510128348
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {"name": "Adam"},
    "geometry": {
      "type": "Point",
      "coordinates": [
        12.56338119506836,
        55.783958091676986
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {"name": "Helle"},
    "geometry": {
      "type": "Point",
      "coordinates": [
        12.557458877563475,
        55.77850389183611
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {"name": "Jan"},
    "geometry": {
      "type": "Point",
      "coordinates": [
        12.572307586669922,
        55.78275147606406
      ]
    }
  }
]

module.exports = {
  gameArea,
  players
}