import os


"""
To make index.html

Have server running with env variables

On demo:
AWS_S3_KEY=voter-turnout
BASE_URL=https://demo.project.gothamist.com
IS_SCREENSHOTTING=false


On Prod:

AWS_S3_KEY=voter-turnout
BASE_URL=https://project.gothamist.com
IS_SCREENSHOTTING=false


Npm run build

Get index file from dist
"""


output_dir = './district_folders_for_s3/'

# get text of index.html to write to file in every folder
with open('../dist/index.html', 'r') as f:
    index_text = f.read()

# get districts from text file
with open('../src/static/data/election_districts.txt', 'r') as f:
    districts = f.read()
    districts = districts.split("\n")[:-1]

# for every district, create a folder (if not exists) and write index.html to folder
for district in districts:
    directory = output_dir + district
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(directory + '/index.html', 'w') as f:
        directory_index_text = index_text.replace("{{id}}", district)
        f.write(directory_index_text)
