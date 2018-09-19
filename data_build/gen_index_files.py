import os


# get text of index.html to write to file in every folder
with open('../src/static/index.html', 'r') as f:
    index_text = f.readlines()

# get districts from text file
with open('../src/static/data/election_districts.txt', 'r') as f:
    districts = f.readlines()
    districts = [line.strip('\n') for line in districts]

# for every district, create a folder (if not exists) and write index.html to folder
for district in districts:
    directory = '../src/static/{}'.format(district)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(directory + '/index.html', 'w') as f:
        f.writelines(index_text)
