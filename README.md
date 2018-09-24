`npm install`

`npm run build`

`npm run watch`




## Generating Data

The voter turnout data comes from two sources<br/>
e.g. 2014 data:<br/>
*Count of registered voters per district:* http://www.elections.ny.gov/2014EnrollmentED.html<br/>
*Number of votes per district:*  http://vote.nyc.ny.us/html/results/2014.shtml

### Manual steps to setup data:
The enrollment data (# of registered voters) is given in the form of 5 pdfs (1 for each county)

To be able to use this data, we convert pdfs to xlsx (manually, using https://www.pdftoexcel.com/)<br/>
And then to csv (by opening in excel as saving as csv - if prompted click "save active sheet" (the others are empty))<br/>
We now have 6 csvs that are converted to dataframes and cleaned up using `data_build/gen_turnout_json.py`

Original pdf files in: `raw_data/2014_pdf`<br/>
csv files in: `data/2014_csv`

The votes per district is already a csv and just needs some parsing (also done using gen_turnout_json):<br/>
`data/votes_ed_level_2014`

Once all csv files are ready, run gen_turnout_json to clean data, compute values, and write to json file.


### To run gen_turnout_json:
Need all 5 enrollment csv files in `data/2014_csv` and votes csv file in data<br/>
setup virtual env and activate:<br/>
`python3 -m venv .venv`<br/>
`source .venv/bin/activate`<br/>
`pip install -r requirements.txt`<br/>

`python3 gen_turnout_json.py`
outputs a json file with data for each district to be used on front end / in map
example:
```
"57023": {
    "voters": 1143,
    "elect_dist": "57023",
    "borough": "Brooklyn",
    "votes": 53,
    "percent": 5.0,
    "boro_rank": 1589,
    "rank": 4991,
    "grade": "F-",
    "color": "#f0f9e8",
    "2016_rank": 5018,
    "2016_percent": 39.0
}
```
and some overall_data:
```
"overall_data": {
    "avg_percent_2014": "23.2",
    "max_rank_2014": "4993",
    "avg_percent_2016": "59.6",
    "max_rank_2016": "5084",
    "by_borough_2014": {
        "Staten Island": {
            "max_rank": "265",
            "avg_percent": "30.4"
        },
        "Manhattan": {
            "max_rank": "1117",
            "avg_percent": "25.8"
        },
        "Queens": {
            "max_rank": "1159",
            "avg_percent": "22.7"
        },
        "Brooklyn": {
            "max_rank": "1590",
            "avg_percent": "22"
        },
        "Bronx": {
            "max_rank": "862",
            "avg_percent": "20.6"
        }
    }
}
```

The json file is saved in the `data_build/parsed_data` folder, and in `src/static/data` so that running the script updates both.<br/>
The script currently uses 2014 and 2016 data and so requires 2014 and 2016 data to be available,
with 2016 data used only for text on the page (2016_rank, 2016_percent).


## Generating Share Images
The share images are generated via `gen_images.py` in 4 steps
1. The folders are created (one for every district)
2. The map screenshots are created by visiting each url and cropping a screenshot and
saved in a single folder for easier visual QA
3. Plots are created - used in share images and on district's page
4. Share images are generated and saved in district folder

Files used to generate the images, such as the emojis with grades live in `image_generation_parts/`

## Generating the map legend
The legend is generated via: `gen_legend.py`, allowing colors to be easily changed


## Neighborhood data
We overlay the neighborhood names using another dataset that has the central long and lat of each neighborhood
source: https://data.cityofnewyork.us/City-Government/Neighborhood-Names-GIS/99bc-9p23/data <br/>
saved in `raw_data/NHoodNameCentroids.csv`<br/>
This data is converted to a json file:
`parsed_data/neighb_coords.js`


## Generating index.htmls
For each district, the index.html file varies slightly - these files are generated with `gen_index_files.py`
(DNE yet)

## Drawing the map
To draw the map, we use a geojson file exported from: https://data.cityofnewyork.us/City-Government/Election-Districts/h2n3-98hq<br/>
To reduce filesize, we truncate longitude and latitude coordinates from 15 to 6 decimal places<br/>
"the sixth decimal place in one decimal degree has 111,111/10^6 = about 1/9 meter = about 4 inches of precision"

## Environment Variables
These variables are used in the build process to prepare the static output for different environments.

Key Name | Description
--- | ---
`AWS_S3_KEY` | The root-relative file path to assets. In development this can be left blank.
`BASE_URL` | The protocol and domain from which this app is served. In development this can be left blank.
