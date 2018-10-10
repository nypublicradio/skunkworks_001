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
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# get text of index.html to write to file in every folder
with open('../dist/index.html', 'r') as f:
    index_text = f.read()

# get districts from text file
with open('../src/static/data/election_districts.txt', 'r') as f:
    districts = f.read()
    districts = districts.split("\n")[:-1]

# for every district, create an index file named for it
for district in districts:
    district_file = output_dir + district
    with open(district_file, 'w') as f:
        directory_index_text = index_text.replace("{{id}}", district)
        f.write(directory_index_text)
