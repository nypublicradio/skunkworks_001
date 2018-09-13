// source: https://data.cityofnewyork.us/City-Government/Neighborhood-Names-GIS/99bc-9p23/data

var neighbs = [
  {
    name: "Wakefield",
    coords: [-73.847200, 40.894705]
  },
  {
    name: "Co-op City",
    coords: [-73.829939, 40.874294]
  },
  {
    name: "Eastchester",
    coords: [-73.827806, 40.887555]
  },
  {
    name: "Fieldston",
    coords: [-73.905642, 40.895437]
  },
  {
    name: "Riverdale",
    coords: [-73.912585, 40.890834]
  },
  {
    name: "Kingsbridge",
    coords: [-73.902817, 40.881687]
  },
  {
    name: "Marble Hill",
    coords: [-73.910659, 40.876550]
  },
  {
    name: "Woodlawn",
    coords: [-73.867314, 40.898272]
  },
  {
    name: "Norwood",
    coords: [-73.879390, 40.877224]
  },
  {
    name: "Williamsbridge",
    coords: [-73.857446, 40.881038]
  },
  {
    name: "Baychester",
    coords: [-73.835797, 40.866858]
  },
  {
    name: "Pelham Parkway",
    coords: [-73.854755, 40.857413]
  },
  {
    name: "City Island",
    coords: [-73.786488, 40.847246]
  },
  {
    name: "Bedford Park",
    coords: [-73.885512, 40.870185]
  },
  {
    name: "University Heights",
    coords: [-73.910415, 40.855727]
  },
  {
    name: "Morris Heights",
    coords: [-73.919671, 40.847897]
  },
  {
    name: "Fordham",
    coords: [-73.896426, 40.860996]
  },
  {
    name: "East Tremont",
    coords: [-73.887356, 40.842696]
  },
  {
    name: "West Farms",
    coords: [-73.877744, 40.839475]
  },
  {
    name: "High  Bridge",
    coords: [-73.926102, 40.836623]
  },
  {
    name: "Melrose",
    coords: [-73.909421, 40.819754]
  },
  {
    name: "Mott Haven",
    coords: [-73.916099, 40.806238]
  },
  {
    name: "Port Morris",
    coords: [-73.913221, 40.801663]
  },
  {
    name: "Longwood",
    coords: [-73.895788, 40.815099]
  },
  {
    name: "Hunts Point",
    coords: [-73.883315, 40.809729]
  },
  {
    name: "Morrisania",
    coords: [-73.901506, 40.823591]
  },
  {
    name: "Soundview",
    coords: [-73.865746, 40.821012]
  },
  {
    name: "Clason Point",
    coords: [-73.854144, 40.806551]
  },
  {
    name: "Throgs Neck",
    coords: [-73.816350, 40.815109]
  },
  {
    name: "Country Club",
    coords: [-73.824099, 40.844245]
  },
  {
    name: "Parkchester",
    coords: [-73.856003, 40.837937]
  },
  {
    name: "Westchester Square",
    coords: [-73.842194, 40.840619]
  },
  {
    name: "Van Nest",
    coords: [-73.866299, 40.843608]
  },
  {
    name: "Morris Park",
    coords: [-73.850401, 40.847549]
  },
  {
    name: "Belmont",
    coords: [-73.888451, 40.857277]
  },
  {
    name: "Spuyten Duyvil",
    coords: [-73.917190, 40.881394]
  },
  {
    name: "North Riverdale",
    coords: [-73.904530, 40.908542]
  },
  {
    name: "Pelham Bay",
    coords: [-73.832073, 40.850641]
  },
  {
    name: "Schuylerville",
    coords: [-73.826202, 40.826579]
  },
  {
    name: "Edgewater Park",
    coords: [-73.813885, 40.821986]
  },
  {
    name: "Castle Hill",
    coords: [-73.848027, 40.819014]
  },
  {
    name: "Olinville",
    coords: [-73.863323, 40.871370]
  },
  {
    name: "Pelham Gardens",
    coords: [-73.841611, 40.862965]
  },
  {
    name: "Concourse",
    coords: [-73.915589, 40.834283]
  },
  {
    name: "Unionport",
    coords: [-73.850535, 40.829774]
  },
  {
    name: "Edenwald",
    coords: [-73.848082, 40.884561]
  },
  {
    name: "Bay Ridge",
    coords: [-74.030620, 40.625801]
  },
  {
    name: "Bensonhurst",
    coords: [-73.995179, 40.611008]
  },
  {
    name: "Sunset Park",
    coords: [-74.010316, 40.645102]
  },
  {
    name: "Greenpoint",
    coords: [-73.954240, 40.730200]
  },
  {
    name: "Gravesend",
    coords: [-73.973470, 40.595260]
  },
  {
    name: "Brighton Beach",
    coords: [-73.965094, 40.576825]
  },
  {
    name: "Sheepshead Bay",
    coords: [-73.943186, 40.586890]
  },
  {
    name: "Manhattan Terrace",
    coords: [-73.957438, 40.614432]
  },
  {
    name: "Flatbush",
    coords: [-73.958401, 40.636325]
  },
  {
    name: "Crown Heights",
    coords: [-73.943291, 40.670829]
  },
  {
    name: "East Flatbush",
    coords: [-73.936102, 40.641717]
  },
  {
    name: "Kensington",
    coords: [-73.980421, 40.642381]
  },
  {
    name: "Windsor Terrace",
    coords: [-73.980073, 40.656945]
  },
  {
    name: "Prospect Heights",
    coords: [-73.964859, 40.676822]
  },
  {
    name: "Brownsville",
    coords: [-73.910235, 40.663949]
  },
  {
    name: "Williamsburg",
    coords: [-73.958115, 40.707144]
  },
  {
    name: "Bushwick",
    coords: [-73.925257, 40.698116]
  },
  {
    name: "Bedford Stuyvesant",
    coords: [-73.941784, 40.687231]
  },
  {
    name: "Brooklyn Heights",
    coords: [-73.993782, 40.695863]
  },
  {
    name: "Cobble Hill",
    coords: [-73.998561, 40.687919]
  },
  {
    name: "Carroll Gardens",
    coords: [-74.000372, 40.682131]
  },
  {
    name: "Red Hook",
    coords: [-74.012758, 40.676253]
  },
  {
    name: "Gowanus",
    coords: [-73.994440, 40.673931]
  },
  {
    name: "Fort Greene",
    coords: [-73.972905, 40.688527]
  },
  {
    name: "Park Slope",
    coords: [-73.977050, 40.672320]
  },
  {
    name: "Cypress Hills",
    coords: [-73.875831, 40.684635]
  },
  {
    name: "East New York",
    coords: [-73.880698, 40.669925]
  },
  {
    name: "Starrett City",
    coords: [-73.879369, 40.647589]
  },
  {
    name: "Canarsie",
    coords: [-73.902092, 40.635564]
  },
  {
    name: "Flatlands",
    coords: [-73.929113, 40.630446]
  },
  {
    name: "Mill Island",
    coords: [-73.908185, 40.606336]
  },
  {
    name: "Manhattan Beach",
    coords: [-73.943537, 40.577913]
  },
  {
    name: "Coney Island",
    coords: [-73.988682, 40.574292]
  },
  {
    name: "Bath Beach",
    coords: [-73.998752, 40.599518]
  },
  {
    name: "Borough Park",
    coords: [-73.990498, 40.633130]
  },
  {
    name: "Dyker Heights",
    coords: [-74.019313, 40.619219]
  },
  {
    name: "Gerritsen Beach",
    coords: [-73.930101, 40.590848]
  },
  {
    name: "Marine Park",
    coords: [-73.931344, 40.609747]
  },
  {
    name: "Clinton Hill",
    coords: [-73.967843, 40.693229]
  },
  {
    name: "Sea Gate",
    coords: [-74.007873, 40.576375]
  },
  {
    name: "Downtown",
    coords: [-73.983463, 40.690844]
  },
  {
    name: "Boerum Hill",
    coords: [-73.983577, 40.687241]
  },
  {
    name: "Prospect Lefferts Gardens",
    coords: [-73.954898, 40.658420]
  },
  {
    name: "Ocean Hill",
    coords: [-73.913068, 40.678402]
  },
  {
    name: "City Line",
    coords: [-73.867975, 40.678569]
  },
  {
    name: "Bergen Beach",
    coords: [-73.898556, 40.615149]
  },
  {
    name: "Midwood",
    coords: [-73.957595, 40.625595]
  },
  {
    name: "Prospect Park South",
    coords: [-73.962613, 40.647008]
  },
  {
    name: "Georgetown",
    coords: [-73.916074, 40.623845]
  },
  {
    name: "Spring Creek",
    coords: [-73.869987, 40.657139]
  },
  {
    name: "East Williamsburg",
    coords: [-73.938858, 40.708492]
  },
  {
    name: "North Side",
    coords: [-73.958808, 40.714822]
  },
  {
    name: "South Side",
    coords: [-73.958000, 40.710861]
  },
  {
    name: "Navy Yard",
    coords: [-73.971644, 40.698790]
  },
  {
    name: "Ocean Parkway",
    coords: [-73.968366, 40.613059]
  },
  {
    name: "Fort Hamilton",
    coords: [-74.031979, 40.614768]
  },
  {
    name: "Chinatown",
    coords: [-73.994279, 40.715618]
  },
  {
    name: "Washington Heights",
    coords: [-73.936900, 40.851902]
  },
  {
    name: "Inwood",
    coords: [-73.921210, 40.867683]
  },
  {
    name: "Hamilton Heights",
    coords: [-73.949687, 40.823604]
  },
  {
    name: "Manhattanville",
    coords: [-73.957385, 40.816934]
  },
  {
    name: "Central Harlem",
    coords: [-73.943211, 40.815976]
  },
  {
    name: "East Harlem",
    coords: [-73.944182, 40.792249]
  },
  {
    name: "Upper East Side",
    coords: [-73.960507, 40.775638]
  },
  {
    name: "Yorkville",
    coords: [-73.947117, 40.775929]
  },
  {
    name: "Lenox Hill",
    coords: [-73.958859, 40.768112]
  },
  {
    name: "Roosevelt Island",
    coords: [-73.949470, 40.762403]
  },
  {
    name: "Upper West Side",
    coords: [-73.977059, 40.787657]
  },
  {
    name: "Lincoln Square",
    coords: [-73.985337, 40.773528]
  },
  {
    name: "Clinton",
    coords: [-73.996407, 40.758333]
  },
  {
    name: "Midtown",
    coords: [-73.981668, 40.754691]
  },
  {
    name: "Murray Hill",
    coords: [-73.978332, 40.748303]
  },
  {
    name: "Chelsea",
    coords: [-74.003116, 40.744034]
  },
  {
    name: "Greenwich Village",
    coords: [-73.999914, 40.726932]
  },
  {
    name: "East Village",
    coords: [-73.982226, 40.727846]
  },
  {
    name: "Lower East Side",
    coords: [-73.980890, 40.717806]
  },
  {
    name: "Tribeca",
    coords: [-74.010683, 40.721521]
  },
  {
    name: "Little Italy",
    coords: [-73.997304, 40.719323]
  },
  {
    name: "Soho",
    coords: [-74.000656, 40.722183]
  },
  {
    name: "West Village",
    coords: [-74.006179, 40.734433]
  },
  {
    name: "Manhattan Valley",
    coords: [-73.964286, 40.797307]
  },
  {
    name: "Morningside Heights",
    coords: [-73.963896, 40.807999]
  },
  {
    name: "Gramercy",
    coords: [-73.981375, 40.737209]
  },
  {
    name: "Battery Park City",
    coords: [-74.016869, 40.711931]
  },
  {
    name: "Financial District",
    coords: [-74.010665, 40.707107]
  },
  {
    name: "Astoria",
    coords: [-73.915653, 40.768508]
  },
  {
    name: "Woodside",
    coords: [-73.901841, 40.746349]
  },
  {
    name: "Jackson Heights",
    coords: [-73.882821, 40.751981]
  },
  {
    name: "Elmhurst",
    coords: [-73.881656, 40.744048]
  },
  {
    name: "Howard Beach",
    coords: [-73.838137, 40.654225]
  },
  {
    name: "South Corona",
    coords: [-73.856824, 40.742381]
  },
  {
    name: "Forest Hills",
    coords: [-73.844475, 40.725263]
  },
  {
    name: "Kew Gardens",
    coords: [-73.829819, 40.705179]
  },
  {
    name: "Richmond Hill",
    coords: [-73.831833, 40.697947]
  },
  {
    name: "Downtown Flushing",
    coords: [-73.829367, 40.761163]
  },
  {
    name: "Long Island City",
    coords: [-73.939202, 40.750217]
  },
  {
    name: "Sunnyside",
    coords: [-73.926916, 40.740176]
  },
  {
    name: "East Elmhurst",
    coords: [-73.867041, 40.764073]
  },
  {
    name: "Maspeth",
    coords: [-73.896217, 40.725427]
  },
  {
    name: "Ridgewood",
    coords: [-73.901435, 40.708323]
  },
  {
    name: "Glendale",
    coords: [-73.870741, 40.702762]
  },
  {
    name: "Rego Park",
    coords: [-73.857826, 40.728974]
  },
  {
    name: "Woodhaven",
    coords: [-73.858110, 40.689886]
  },
  {
    name: "Ozone Park",
    coords: [-73.843202, 40.680708]
  },
  {
    name: "South Ozone Park",
    coords: [-73.809864, 40.668549]
  },
  {
    name: "College Point",
    coords: [-73.843045, 40.784902]
  },
  {
    name: "Whitestone",
    coords: [-73.814202, 40.781290]
  },
  {
    name: "Bayside",
    coords: [-73.774273, 40.766040]
  },
  {
    name: "Auburndale",
    coords: [-73.791762, 40.761729]
  },
  {
    name: "Little Neck",
    coords: [-73.738897, 40.770826]
  },
  {
    name: "Douglaston",
    coords: [-73.742498, 40.766846]
  },
  {
    name: "Glen Oaks",
    coords: [-73.715481, 40.749440]
  },
  {
    name: "Bellerose",
    coords: [-73.720128, 40.728573]
  },
  {
    name: "Kew Gardens Hills",
    coords: [-73.820877, 40.722578]
  },
  {
    name: "Fresh Meadows",
    coords: [-73.782713, 40.734394]
  },
  {
    name: "Briarwood",
    coords: [-73.811748, 40.710935]
  },
  {
    name: "Jamaica Center",
    coords: [-73.796901, 40.704657]
  },
  {
    name: "Oakland Gardens",
    coords: [-73.754949, 40.745618]
  },
  {
    name: "Queens Village",
    coords: [-73.738714, 40.718893]
  },
  {
    name: "Hollis",
    coords: [-73.759250, 40.711243]
  },
  {
    name: "South Jamaica",
    coords: [-73.790426, 40.696911]
  },
  {
    name: "St. Albans",
    coords: [-73.758676, 40.694445]
  },
  {
    name: "Rochdale",
    coords: [-73.772587, 40.675211]
  },
  {
    name: "Springfield Gardens",
    coords: [-73.760420, 40.666230]
  },
  {
    name: "Cambria Heights",
    coords: [-73.735268, 40.692774]
  },
  {
    name: "Rosedale",
    coords: [-73.735260, 40.659816]
  },
  {
    name: "Far Rockaway",
    coords: [-73.754979, 40.603134]
  },
  {
    name: "Broad Channel",
    coords: [-73.820054, 40.603026]
  },
  {
    name: "Breezy Point",
    coords: [-73.925511, 40.557401]
  },
  {
    name: "Steinway",
    coords: [-73.902289, 40.775923]
  },
  {
    name: "Beechhurst",
    coords: [-73.804364, 40.792781]
  },
  {
    name: "Bay Terrace",
    coords: [-73.776802, 40.782842]
  },
  {
    name: "Edgemere",
    coords: [-73.776132, 40.595641]
  },
  {
    name: "Arverne",
    coords: [-73.791992, 40.589143]
  },
  {
    name: "Seaside",
    coords: [-73.822361, 40.582801]
  },
  {
    name: "Neponsit",
    coords: [-73.857546, 40.572036]
  },
  {
    name: "Murray Hill",
    coords: [-73.812762, 40.764126]
  },
  {
    name: "Floral Park",
    coords: [-73.708847, 40.741378]
  },
  {
    name: "Holliswood",
    coords: [-73.767141, 40.720957]
  },
  {
    name: "Jamaica Estates",
    coords: [-73.787226, 40.716804]
  },
  {
    name: "Queensboro Hill",
    coords: [-73.825809, 40.744572]
  },
  {
    name: "Hillcrest",
    coords: [-73.797603, 40.723824]
  },
  {
    name: "Ravenswood",
    coords: [-73.931575, 40.761704]
  },
  {
    name: "Lindenwood",
    coords: [-73.849637, 40.663918]
  },
  {
    name: "Laurelton",
    coords: [-73.740256, 40.667883]
  },
  {
    name: "Lefrak City",
    coords: [-73.862524, 40.736074]
  },
  {
    name: "Belle Harbor",
    coords: [-73.854017, 40.576155]
  },
  {
    name: "Rockaway Park",
    coords: [-73.841533, 40.580342]
  },
  {
    name: "Somerville",
    coords: [-73.796647, 40.597710]
  },
  {
    name: "Brookville",
    coords: [-73.751753, 40.660003]
  },
  {
    name: "Bellaire",
    coords: [-73.738891, 40.733014]
  },
  {
    name: "North Corona",
    coords: [-73.857517, 40.754070]
  },
  {
    name: "Forest Hills Gardens",
    coords: [-73.841022, 40.714611]
  },
  {
    name: "St. George",
    coords: [-74.079353, 40.644981]
  },
  {
    name: "New Brighton",
    coords: [-74.087016, 40.640614]
  },
  {
    name: "Stapleton",
    coords: [-74.077901, 40.626927]
  },
  {
    name: "Rosebank",
    coords: [-74.069805, 40.615304]
  },
  {
    name: "West Brighton",
    coords: [-74.107181, 40.631878]
  },
  {
    name: "Grymes Hill",
    coords: [-74.087248, 40.624184]
  },
  {
    name: "Todt Hill",
    coords: [-74.111328, 40.597068]
  },
  {
    name: "South Beach",
    coords: [-74.079552, 40.580247]
  },
  {
    name: "Port Richmond",
    coords: [-74.129434, 40.633669]
  },
  {
    name: "Mariner's Harbor",
    coords: [-74.150085, 40.632546]
  },
  {
    name: "Port Ivory",
    coords: [-74.174645, 40.639682]
  },
  {
    name: "Castleton Corners",
    coords: [-74.119180, 40.613335]
  },
  {
    name: "New Springville",
    coords: [-74.164960, 40.594252]
  },
  {
    name: "Travis",
    coords: [-74.190737, 40.586313]
  },
  {
    name: "New Dorp",
    coords: [-74.116479, 40.572572]
  },
  {
    name: "Oakwood",
    coords: [-74.121565, 40.558462]
  },
  {
    name: "Great Kills",
    coords: [-74.149323, 40.549480]
  },
  {
    name: "Eltingville",
    coords: [-74.164330, 40.542230]
  },
  {
    name: "Annadale",
    coords: [-74.178548, 40.538114]
  },
  {
    name: "Woodrow",
    coords: [-74.221350, 40.537452]
  },
  {
    name: "Tottenville",
    coords: [-74.246569, 40.505333]
  },
  {
    name: "Tompkinsville",
    coords: [-74.080553, 40.637316]
  },
  {
    name: "Silver Lake",
    coords: [-74.096290, 40.619193]
  },
  {
    name: "Sunnyside",
    coords: [-74.097125, 40.612760]
  },
  {
    name: "Ditmas Park",
    coords: [-73.961013, 40.643675]
  },
  {
    name: "Wingate",
    coords: [-73.937186, 40.660946]
  },
  {
    name: "Rugby",
    coords: [-73.926882, 40.655572]
  },
  {
    name: "Park Hill",
    coords: [-74.080157, 40.609190]
  },
  {
    name: "Westerleigh",
    coords: [-74.133041, 40.621090]
  },
  {
    name: "Graniteville",
    coords: [-74.153152, 40.620171]
  },
  {
    name: "Arlington",
    coords: [-74.165104, 40.635325]
  },
  {
    name: "Arrochar",
    coords: [-74.067123, 40.596312]
  },
  {
    name: "Grasmere",
    coords: [-74.076674, 40.598268]
  },
  {
    name: "Old Town",
    coords: [-74.087511, 40.596328]
  },
  {
    name: "Dongan Hills",
    coords: [-74.096399, 40.588672]
  },
  {
    name: "Midland Beach",
    coords: [-74.093482, 40.573526]
  },
  {
    name: "Grant City",
    coords: [-74.105855, 40.576215]
  },
  {
    name: "New Dorp Beach",
    coords: [-74.104327, 40.564255]
  },
  {
    name: "Bay Terrace",
    coords: [-74.139166, 40.553988]
  },
  {
    name: "Huguenot",
    coords: [-74.191741, 40.531911]
  },
  {
    name: "Pleasant Plains",
    coords: [-74.219831, 40.524699]
  },
  {
    name: "Butler Manor",
    coords: [-74.229503, 40.506081]
  },
  {
    name: "Charleston",
    coords: [-74.232157, 40.530531]
  },
  {
    name: "Rossville",
    coords: [-74.215728, 40.549404]
  },
  {
    name: "Arden Heights",
    coords: [-74.185886, 40.549285]
  },
  {
    name: "Greenridge",
    coords: [-74.191506, 40.559712]
  },
  {
    name: "Heartland Village",
    coords: [-74.159022, 40.589138]
  },
  {
    name: "Chelsea",
    coords: [-74.189560, 40.594726]
  },
  {
    name: "Bloomfield",
    coords: [-74.187256, 40.605778]
  },
  {
    name: "Bulls Head",
    coords: [-74.159409, 40.609591]
  },
  {
    name: "Carnegie Hill",
    coords: [-73.953256, 40.782682]
  },
  {
    name: "Noho",
    coords: [-73.988433, 40.723259]
  },
  {
    name: "Civic Center",
    coords: [-74.005415, 40.715228]
  },
  {
    name: "Midtown South",
    coords: [-73.988713, 40.748509]
  },
  {
    name: "Richmond Town",
    coords: [-74.134057, 40.569605]
  },
  {
    name: "Shore Acres",
    coords: [-74.066677, 40.609719]
  },
  {
    name: "Clifton",
    coords: [-74.072642, 40.619178]
  },
  {
    name: "Concord",
    coords: [-74.084023, 40.604473]
  },
  {
    name: "Emerson Hill",
    coords: [-74.097762, 40.606794]
  },
  {
    name: "Randall Manor",
    coords: [-74.098050, 40.635630]
  },
  {
    name: "Howland Hook",
    coords: [-74.186223, 40.638432]
  },
  {
    name: "Elm Park",
    coords: [-74.141816, 40.630146]
  },
  {
    name: "Remsen Village",
    coords: [-73.916653, 40.652117]
  },
  {
    name: "New Lots",
    coords: [-73.885117, 40.662744]
  },
  {
    name: "Paerdegat Basin",
    coords: [-73.902334, 40.631317]
  },
  {
    name: "Mill Basin",
    coords: [-73.915153, 40.615974]
  },
  {
    name: "Jamaica Hills",
    coords: [-73.796464, 40.711459]
  },
  {
    name: "Utopia",
    coords: [-73.796716, 40.733500]
  },
  {
    name: "Pomonok",
    coords: [-73.804861, 40.734936]
  },
  {
    name: "Astoria Heights",
    coords: [-73.894679, 40.770317]
  },
  {
    name: "Claremont Village",
    coords: [-73.901199, 40.831428]
  },
  {
    name: "Concourse Village",
    coords: [-73.915846, 40.824780]
  },
  {
    name: "Mount Eden",
    coords: [-73.916555, 40.843826]
  },
  {
    name: "Mount Hope",
    coords: [-73.908299, 40.848841]
  },
  {
    name: "Sutton Place",
    coords: [-73.963556, 40.760280]
  },
  {
    name: "Hunters Point",
    coords: [-73.953867, 40.743414]
  },
  {
    name: "Turtle Bay",
    coords: [-73.967708, 40.752042]
  },
  {
    name: "Tudor City",
    coords: [-73.971219, 40.746917]
  },
  {
    name: "Stuyvesant Town",
    coords: [-73.974051, 40.730999]
  },
  {
    name: "Flatiron",
    coords: [-73.990947, 40.739673]
  },
  {
    name: "Sunnyside Gardens",
    coords: [-73.918192, 40.745651]
  },
  {
    name: "Blissville",
    coords: [-73.932442, 40.737250]
  },
  {
    name: "Fulton Ferry",
    coords: [-73.995507, 40.703281]
  },
  {
    name: "Vinegar Hill",
    coords: [-73.981116, 40.703321]
  },
  {
    name: "Weeksville",
    coords: [-73.930531, 40.675039]
  },
  {
    name: "Broadway Junction",
    coords: [-73.903316, 40.677861]
  },
  {
    name: "Dumbo",
    coords: [-73.988752, 40.703176]
  },
  {
    name: "Manor Heights",
    coords: [-74.120593, 40.601809]
  },
  {
    name: "Willowbrook",
    coords: [-74.132084, 40.603706]
  },
  {
    name: "Sandy Ground",
    coords: [-74.217766, 40.541139]
  },
  {
    name: "Egbertville",
    coords: [-74.127272, 40.579118]
  },
  {
    name: "Roxbury",
    coords: [-73.892137, 40.567375]
  },
  {
    name: "Homecrest",
    coords: [-73.959184, 40.598525]
  },
  {
    name: "Middle Village",
    coords: [-73.881143, 40.716414]
  },
  {
    name: "Prince's Bay",
    coords: [-74.201525, 40.526264]
  },
  {
    name: "Lighthouse Hill",
    coords: [-74.137926, 40.576506]
  },
  {
    name: "Richmond Valley",
    coords: [-74.229570, 40.519541]
  },
  {
    name: "Malba",
    coords: [-73.826677, 40.790601]
  },
  {
    name: "Highland Park",
    coords: [-73.890280, 40.682485]
  },
  {
    name: "Madison",
    coords: [-73.948415, 40.609377]
  }
]
