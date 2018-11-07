import csv
import json
import tempfile

import numpy as np
import pandas as pd


# Manual work before running this:
# To get the number of enrolled voters - there are 5 pdfs (1 for each county):
# http://www.elections.ny.gov/2014EnrollmentED.html
# http://www.elections.ny.gov/2016EnrollmentED.html
# pdfs were converted to xlsx using https://www.pdftoexcel.com/
# then opened in excel and saved as csv --
# if prompted click "save active sheet" (the others are empty)


count_votes_file = 'votes_ed_level_'
registered_votes_files = [
    'BronxED_nov',
    'KingsED_nov',
    'NewYorkED_nov',
    'QueensED_nov',
    'RichmondED_nov'
]


def get_count_voted_by_district(filename):
    """ Parse csvs from http://vote.nyc.ny.us/html/results/2014.shtml
        Sum votes per district
    """
    df = pd.read_csv(filename)
    # Combine assembly district and election district (with leading zeros)
    # to get standardized 5 digit election district
    df['elect_dist'] = df['AD'].astype(str) + df['ED'].astype(str).str.zfill(3)
    election_districts = df.elect_dist.unique()
    # NOTE: There is a status column 'EDAD Status' that mostly had INPLAY but also has "COMBINED INTO 058/64"
    # We are ignoring this
    df.rename(columns={'Tally': 'votes'}, inplace=True)
    # Clean commas from votes and convert to numeric to sum
    df['votes'] = df['votes'].astype(str).map(lambda x: ''.join([char for char in x if char != ',']))
    df['votes'] = pd.to_numeric(df['votes'])
    # Only sum votes for votes where unit name not in public counter, manually counted emergency, absentee/military
    # df = df[~df['Unit Name'].isin(["Public Counter", "Manually Counted Emergency", "Absentee / Military"])]
    df = df[~df['Unit Name'].isin(["Public Counter"])]
    counts_df = df[['elect_dist', 'votes']].groupby('elect_dist')['votes'].sum().reset_index()
    return counts_df, list(election_districts)


def convert_registered_csv_to_df(csv_filename):
    """ Converts messy csv files of pages of tables to a useable dataframe
    """
    with open(csv_filename) as f:
        lines = f.readlines()
    tables = []
    write_table = False
    table = []
    # Generate a list of tables (effectively removing lines between tables)
    for line in lines:
        if line[:6] == 'COUNTY':
            # header found - set write table to True
            write_table = True
        if line.strip(',') == '\n' and table != []:
            # end of table - add table to list and clear table
            tables.append(table)
            table = []
            write_table = False
        if write_table:
            # writing to table
            table.append(line)
    # Convert list of tables to list of dfs, then concat into one df
    page_dfs = []
    for table in tables:
        # Read rows as a list of values using csv reader
        reader = csv.reader(table, skipinitialspace=True)
        lines = [x for x in reader]
        # read lines into dataframe with the first line as a header
        page_df = pd.DataFrame(columns=lines[0], data=lines[1:])
        # a column adjacent to ELECTION_DIST with no name also contains election dist data
        page_df['ELECTION DIST'] = page_df[''] + ' ' + page_df['ELECTION DIST']
        page_dfs.append(page_df)
    df = pd.concat(page_dfs)
    return df


def get_count_registered_by_district(dfs, boroughs):
    # Parse each df (1 for each county) to get total registered by district
    # and concat into one df
    # Returns number of eligible voters in each district in NYC for given year
    election_districts = []
    clean_dfs = []
    i = 0
    for df in dfs:
        df = df[~df.COUNTY.isnull()]
        # Get election district from column
        df['elect_dist'] = df['ELECTION DIST'].str.extract('(\d+)')
        df = df[~df.elect_dist.isnull()]
        election_districts.extend(df.elect_dist.unique())
        df = df[df.STATUS == 'Total']
        df = df[['TOTAL', 'elect_dist']]
        df['TOTAL'] = df['TOTAL'].map(lambda x: ''.join([char for char in x if char != ',']))
        df['TOTAL'] = pd.to_numeric(df['TOTAL'])
        df.rename(columns={'TOTAL': 'voters'}, inplace=True)
        df['voters'] = df['voters'].astype(int)
        df['borough'] = boroughs[i]
        print(boroughs[i], len(df))
        clean_dfs.append(df)
        i += 1
    ed_data = pd.concat(clean_dfs)
    return ed_data, list(election_districts)


def get_voter_turnout(year='2016'):
    """ From year yyyy return df of voter turnout
        include percent voted, grade, rank, #voters, #registered
    """
    # Get count voted by district as df
    voted_count_df, election_districts_voted = get_count_voted_by_district('data/' + count_votes_file + year)
    # Get number registered by district as df (csv_filename = '2014_csv/BronxED_nov14.csv')
    registered_files = ['data/' + year + '_csv/' + fn + year[-2:] + '.csv' for fn in registered_votes_files]
    reg_dfs = [convert_registered_csv_to_df(file) for file in registered_files]
    counties = [fn.split('ED')[0] for fn in registered_votes_files]
    counties_to_boroughs = {
        'Bronx': 'Bronx',
        'Kings': 'Brooklyn',
        'NewYork': 'Manhattan',
        'Queens': 'Queens',
        'Richmond': 'Staten Island'
    }
    boroughs = [counties_to_boroughs[county] for county in counties]
    registered_count_df, election_districts_reg = get_count_registered_by_district(reg_dfs, boroughs)
    # combine list of all election districts from both data sources
    all_election_districts = election_districts_voted + election_districts_reg
    all_election_districts = list(set(all_election_districts))
    all_election_districts = [str(x)+"\n" for x in all_election_districts]

    # registered_count_df['TOTAL'].sum() = 4927362
    # Compute percent
    turnout_df = registered_count_df.merge(voted_count_df, on='elect_dist', how='outer')
    # filter out inactive districts for which data is less reliable
    turnout_df = turnout_df[turnout_df.votes > 0]
    turnout_df = turnout_df[turnout_df.voters > 100]
    turnout_df['percent'] = 100*(turnout_df['votes'] / turnout_df['voters'])
    turnout_df['percent'] = turnout_df['percent'].round(1)
    turnout_df['voters'] = turnout_df['voters'].astype(int)
    # what percent of the borough overall voted:
    # for borough in turnout_df.borough.unique():
    #     number_of_voters_in_borough = turnout_df[turnout_df.borough==borough].votes.sum()
    #     number_registered_in_borough = turnout_df[turnout_df.borough==borough].voters.sum()
    #     print(borough, number_of_voters_in_borough/number_registered_in_borough)

    return turnout_df, all_election_districts


def add_grades(turnout_df):
    # rank by borough
    turnout_df.sort_values(['borough', 'percent'], inplace=True, ascending=[True, False])
    turnout_df['boro_rank'] = turnout_df.groupby('borough').cumcount() + 1
    # get rank
    turnout_df.sort_values('percent', inplace=True, ascending=False)
    turnout_df['rank'] = range(1, len(turnout_df) + 1)

    # It's important that ratio is sorted in descending order (done directly above) to assign grades
    # compute grades based on a curve
    scale = len(turnout_df)

    # curved_grading_system = {
    #     'A+': round(.05*scale),
    #     'A': round(.15*scale) - round(.05*scale),
    #     'B': round(.35*scale) - round(.15*scale),
    #     'C': round(.55*scale) - round(.35*scale),
    #     'D': round(.75*scale) - round(.55*scale),
    #     'F': round(.90*scale) - round(.75*scale),
    #     'F-': scale - round(.90*scale),
    # }
    # Note: The original grading system was generated on a curve using the code above.
    # To make the grading system consistent between multiple years, we'll hardcode the scale from 2014
    # When we run for 2018 midterms for example, we'll want districts that show improvement
    # since 2014 to receive higher grades than they did in 2014
    # (using the same scale guarantees this desired behavior)

    # 2014 grading system by percent
    # A+ : 37.2 - 71.6%
    # A: 31.6  - 37.1%
    # B: 25.5 - 31.5%
    # C: 21.2 - 25.5%
    # D: 17.3 - 21.2%
    # F: 14.2- 17.3%
    # F-: .9 - 14.2%
    grade_distribution = {
        'num_A+': len(turnout_df[turnout_df.percent>=37.2]),
        'num_A_and_up': len(turnout_df[turnout_df.percent>=31.6]),
        'num_B_and_up': len(turnout_df[turnout_df.percent>=25.5]),
        'num_C_and_up': len(turnout_df[turnout_df.percent>=21.2]),
        'num_D_and_up': len(turnout_df[turnout_df.percent>=17.3]),
        'num_F_and_up': len(turnout_df[turnout_df.percent>=14.2]),
        'num_F-': len(turnout_df[turnout_df.percent<14.2])
    }
    curved_grading_system = {
        'A+': grade_distribution['num_A+'],
        'A': grade_distribution['num_A_and_up'] - grade_distribution['num_A+'],
        'B': grade_distribution['num_B_and_up'] - grade_distribution['num_A_and_up'],
        'C': grade_distribution['num_C_and_up'] - grade_distribution['num_B_and_up'],
        'D': grade_distribution['num_D_and_up'] - grade_distribution['num_C_and_up'],
        'F': grade_distribution['num_F_and_up'] - grade_distribution['num_D_and_up'],
        'F-': grade_distribution['num_F-']
    }
    # dark blue - pale yellow : color scheme
    # from http://colorbrewer2.org/?type=sequential&scheme=YlGnBu&n=3#type=sequential&scheme=YlGnBu&n=7
    hex_codes_1 = ['#0c2c84', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#ffffcc']
    hex_codes_2 = ['#08589e', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#f0f9e8']

    # create columns for grade and color
    grades = []
    color = []
    for i, grade in enumerate(['A+', 'A', 'B', 'C', 'D', 'F', 'F-']):
        grades.extend([grade]*curved_grading_system[grade])
        color.extend([hex_codes_2[i]]*curved_grading_system[grade])
    turnout_df['grade'] = grades
    turnout_df['color'] = color
    return turnout_df


def get_borough_ranking(turnout_df):
    # ranking of borough
    # which borough got the most voters out?
    borough_votes = turnout_df[['votes', 'borough']].groupby('borough')['votes'].sum().reset_index()
    borough_voters = turnout_df[['borough', 'voters']].groupby('borough')['voters'].sum().reset_index()
    borough_ranking = borough_votes.merge(borough_voters, on='borough')
    borough_ranking['ratio'] = borough_ranking['votes']/borough_ranking['voters']
    borough_ranking.sort_values('ratio', inplace=True, ascending=False)
    borough_ranking['rank'] = range(1, len(borough_ranking) + 1)
    overall_data = dict()
    boroughs = borough_ranking.borough.unique()
    for borough in boroughs:
        # max rank for each borough
        max_rank_borough = turnout_df[turnout_df['borough'] == borough]['boro_rank'].max()
        # average percent per borough
        avg_percent_borough = turnout_df[turnout_df['borough'] == borough]['percent'].mean()
        overall_data[borough] = {
            'max_rank': str(max_rank_borough),
            'avg_percent': '%g' % (round(avg_percent_borough, 1))
        }
    return overall_data


def add_election_year(turnout_df, turnout_df_2016):
    """ Adds basic data (rank, percent) about another election year
    """
    turnout_df_2016.sort_values('percent', inplace=True, ascending=False)
    turnout_df_2016['2016_rank'] = range(1, len(turnout_df_2016) + 1)
    turnout_df_2016.rename(columns={'percent': '2016_percent'}, inplace=True)
    turnout_df_2016 = turnout_df_2016[['elect_dist', '2016_rank', '2016_percent']]
    # add columns 2016_rank, 2016_percent to turnout df
    turnout_df_2016['2016_rank'] = turnout_df_2016['2016_rank'].astype(str)
    turnout_df = turnout_df.merge(turnout_df_2016, on='elect_dist', how='left')
    turnout_df[['2016_rank', '2016_percent']] = turnout_df[['2016_rank', '2016_percent']].fillna('N/A')
    return turnout_df


# Get turnout df and list of districts (including inactive)
turnout_df, districts_list = get_voter_turnout('2014')
# Add grades and color
turnout_df = add_grades(turnout_df)
# Get max rank and average percent for each borough
overall_data = get_borough_ranking(turnout_df)
# Get turnout df and list of districts (including inactive) for 2016
turnout_df_2016, districts_list_2016 = get_voter_turnout('2016')
# Add basic data from 2016 to turnout df
turnout_df = add_election_year(turnout_df, turnout_df_2016)


# Make json file
turnout_dict = turnout_df.to_dict(orient='records')
turnout_dict_final = {row['elect_dist']: row for row in turnout_dict}
# add overall data
# citywide average as percent
avg_percent = turnout_df.percent.mean()
avg_percent_2016 = turnout_df_2016.percent.mean()
# max rank for whole city
max_rank_overall = turnout_df['rank'].max()
max_rank_overall_2016 = turnout_df_2016['2016_rank'].max()

turnout_dict_final['overall_data'] = {
    'avg_percent_2014': '%g' % (round(avg_percent, 1)),
    'max_rank_2014': str(max_rank_overall),
    'avg_percent_2016': '%g' % (round(avg_percent_2016, 1)),
    'max_rank_2016': str(max_rank_overall_2016),
    'by_borough_2014': overall_data
}
# write data to json file - save in two locations (in parsed_data and in src/static)
with open('./parsed_data/turnout_by_district.json', 'w') as fp:
    json.dump(turnout_dict_final, fp)
with open('../src/static/data/turnout_by_district.json', 'w') as fp:
    json.dump(turnout_dict_final, fp)
# write to file of valid election districts
all_election_districts = list(set(districts_list + districts_list_2016))
all_election_districts.sort()
with open('../src/static/data/election_districts.txt', 'w') as f:
    f.writelines(all_election_districts)
