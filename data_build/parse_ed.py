import csv
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

# for readme - explain folder structure (original excels)

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
        Sum tally per district
    """
    df = pd.read_csv(filename)
    # Combine assembly district and election district (with leading zeros)
    # to get standardized 5 digit election district
    df['elect_dist'] = df['AD'].astype(str) + df['ED'].astype(str).str.zfill(3)
    # There is a status column 'EDAD Status' that mostly had INPLAY but also has "COMBINED INTO 058/64"
    # let's figure out where to count it
    # For now I'll just sum across district
    df.rename(columns={'Tally': 'tally'}, inplace=True)
    # Clean commas from tally and convert to numeric to sum

    df['tally'] = df['tally'].astype(str).map(lambda x: ''.join([char for char in x if char != ',']))
    df['tally'] = pd.to_numeric(df['tally'])
    # Only sum tally for votes where unit name not in public counter, manually counted emergency, absentee/military
    # df = df[~df['Unit Name'].isin(["Public Counter", "Manually Counted Emergency", "Absentee / Military"])]
    df = df[~df['Unit Name'].isin(["Public Counter"])]
    counts_df = df[['elect_dist', 'tally']].groupby('elect_dist')['tally'].sum().reset_index()
    print("COUNTS VOTED")
    print(len(counts_df))
    print(counts_df.columns)
    return counts_df

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
    print("Generated df from csvs")
    print(csv_filename, len(df))
    return df

def get_count_registered_by_district(dfs, counties):
    # Parse each df (1 for each county) to get total registered by district
    # and concat into one df
    # Returns number of eligible voters in each district in NYC for given year
    clean_dfs = []
    i = 0
    for df in dfs:
        df = df[~df.COUNTY.isnull()]
        # Get election district from column
        df['elect_dist'] = df['ELECTION DIST'].str.extract('(\d+)')
        df = df[~df.elect_dist.isnull()]
        df = df[df.STATUS=='Total']
        df = df[['TOTAL', 'elect_dist']]
        df['TOTAL'] = df['TOTAL'].map(lambda x: ''.join([char for char in x if char != ',']))
        df['TOTAL'] = pd.to_numeric(df['TOTAL'])
        df.rename(columns={'TOTAL': 'num_registered'}, inplace=True)
        df['county'] = counties[i]
        print(counties[i], len(df))
        clean_dfs.append(df)
        i += 1
    ed_data = pd.concat(clean_dfs)
    print("Count registered")
    print(ed_data.columns)
    print(len(ed_data))
    return ed_data

def get_voter_turnout(year='2016', election_name="presidential"):
    """ From year yyyy return df of voter turnout
        include percent voted, grade, rank, #voters, #registered
    """
    # Get count voted by district as df
    # csv_filename = '2014_csv/BronxED_nov14.csv'
    voted_count_df = get_count_voted_by_district('data/' + count_votes_file + year)
    voted_count_df['election'] = election_name
    # Get number registered by district as df
    registered_files = ['data/' + year + '_csv/' + fn + year[-2:] + '.csv' for fn in registered_votes_files]
    reg_dfs = [convert_registered_csv_to_df(file) for file in registered_files]
    counties = [fn.split('ED')[0] for fn in registered_votes_files]
    print(counties)
    # import ipdb; ipdb.set_trace()
    registered_count_df = get_count_registered_by_district(reg_dfs, counties)
    # registered_count_df['TOTAL'].sum() = 4927362
    # Compute percent
    turnout_df = registered_count_df.merge(voted_count_df, on='elect_dist', how='outer')

    dead_election_districts = turnout_df[turnout_df.tally==0].elect_dist.unique()
    turnout_df = turnout_df[turnout_df.tally > 0]

    turnout_df = turnout_df[turnout_df.num_registered > 100]
    turnout_df['ratio'] = turnout_df['tally'] / turnout_df['num_registered']

    for county in turnout_df.county.unique():
        print(county, turnout_df[turnout_df.county==county].tally.sum()/turnout_df[turnout_df.county==county].num_registered.sum())

    turnout_df['percent'] = turnout_df['ratio']*100
    turnout_df['percent'] = turnout_df['percent'].round()

    turnout_df.to_csv('voter_turnout_' + election_name + year)
    return turnout_df


turnout_df = get_voter_turnout('2014', 'gubernatorial')
# get avg ratio and then
# get rank
turnout_df.sort_values('ratio', inplace=True, ascending=False)
turnout_df['rank'] = range(1, len(turnout_df) + 1)


# rank by borough

# ----- add this

# compute grades based on a curve
scale = len(turnout_df)
curved_grading_system = {
    'A+': round(.05*scale),
    'A': round(.15*scale) - round(.05*scale),
    'B': round(.35*scale) - round(.15*scale),
    'C': round(.55*scale) - round(.35*scale),
    'D': round(.75*scale) - round(.55*scale),
    'F': round(.90*scale) - round(.75*scale),
    'F-': scale - round(.90*scale),
}
grades = []
for grade in ['A+', 'A', 'B', 'C', 'D', 'F', 'F-']:
    grades.extend([grade]*curved_grading_system[grade])
turnout_df['grade'] = grades

# add color from letter grade



# ranking of borough
# which borough got the most voters out?
borough_tally = turnout_df[['tally', 'county']].groupby('county')['tally'].sum().reset_index()
borough_voters = turnout_df[['county', 'num_registered']].groupby('county')['num_registered'].sum().reset_index()
borough_ranking = borough_tally.merge(borough_voters, on='county')
borough_ranking['ratio'] = borough_ranking['tally']/borough_ranking['num_registered']
borough_ranking.sort_values('ratio', inplace=True, ascending=False)
borough_ranking['rank'] = range(1, len(borough_ranking) + 1)
# citywide average as percent
borough_ranking['city_wide_avg'] = 100*turnout_df.ratio.mean()


# could add conditional string - "below" or "above" with comparison to avg

# 2016 - district, rank, percent
turnout_df_2016 = get_voter_turnout('2016', 'presidential')
turnout_df_2016.sort_values('ratio', inplace=True, ascending=False)
turnout_df_2016['rank'] = range(1, len(turnout_df_2016) + 1)
turnout_df_2016 = turnout_df_2016[['elect_dist', 'rank', 'percent']]


# make json file
# turnout_dict =



import ipdb; ipdb.set_trace()


# d3 to do:
# get rid of dot
# try mapping colors





















