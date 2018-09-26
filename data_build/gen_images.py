import json
import math
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont


"""
This is a script to generate the images used for sharing.
Images are saved as district_folders_for_s3/<district_number>/share_image.png
The map view of the district is generated using gen_map_screenshot.py
to screenshot a cropped map displayed on the url:
http://localhost:3000/<district_number>/
for each district.
Using data in turnout_by_district.json:
    The plots are generated using the percent turnout
    The emoji and grade are chosen from the folder based on the grade

To run this script:

npm install
npm run build
npm run watch

python3 gen_images.py
"""

image_dir = './image_generation_parts/'
output_dir = './district_folders_for_s3/'
grey = (223, 223, 223)
charcoal = (51, 51, 51)
blue = (30, 102, 202)


def save_boxplots(district, district_percent, overall_percent):
    """ Generates a bar plot for district and saves image to the district folder
    """
    background = Image.open(image_dir + "background.png")
    chart_background = background.resize((844, 310))
    corner_x, corner_y = 21, 77

    # Draw box plots
    draw = ImageDraw.Draw(chart_background)

    box_w, box_h = 800, 70
    color_width1 = 8*district_percent
    line_width = 3
    # First bar (how your district did)
    draw.rectangle((corner_x, corner_y, corner_x + box_w, corner_y + box_h), fill=grey)
    draw.rectangle((corner_x, corner_y, corner_x + color_width1, corner_y + box_h), fill=blue)
    # draw little line
    draw.rectangle((
        corner_x + color_width1,
        corner_y - 35,
        corner_x + color_width1 + line_width,
        corner_y + box_h
    ), fill=charcoal)
    # add percent text
    draw = ImageDraw.Draw(chart_background)
    font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 24)
    district_percent_text = '%g' % (round(district_percent, 1))
    draw.text(
        (corner_x + color_width1 - 10, corner_y - 75),
        "{}%".format(district_percent_text),
        charcoal,
        font=font
    )

    # Second bar
    corner2_y = corner_y + box_h + 14
    color_width2 = 8 * overall_percent
    draw.rectangle((corner_x, corner2_y, corner_x + box_w, corner2_y + box_h), fill=grey)
    draw.rectangle((corner_x, corner2_y, corner_x + color_width2, corner2_y + box_h), fill=charcoal)
    # draw little line
    draw.rectangle((
        corner_x + color_width2,
        corner2_y,
        corner_x + color_width2 + line_width,
        corner2_y + box_h + 35
    ), fill=charcoal)
    # add percent text
    draw = ImageDraw.Draw(chart_background)
    font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 24)
    overall_percent_text = '%g' % (round(overall_percent, 1))
    draw.text(
        (corner_x + color_width2 - 10, corner2_y + 108),
        "{}%".format(overall_percent_text),
        charcoal,
        font=font
    )
    # save file
    directory = output_dir + district
    chart_background.save(directory + '/{}_plots.png'.format(district))


def draw_and_save_img(district, grade, district_percent, overall_percent):
    """ Gernerates the share image and saves image to the district folder
    """
    directory = output_dir + district

    # Add emoji_image
    background = Image.open(image_dir + "background.png")
    emoji_img = Image.open(image_dir + "Emoji_Grade_Images/-g-All-{}.png".format(grade)).convert("RGBA")
    background.paste(emoji_img, (130, 230), emoji_img)

    # Get map image and add to background
    map_pic = Image.open(image_dir + '/ed_map_screenshots/map_{}.png'.format(district))
    background.paste(map_pic, (670, 250), map_pic)

    # Add static text
    my_district_text = Image.open(image_dir + "my_district_text.png").convert("RGBA")
    comparing_text = Image.open(image_dir + "comparing_turnout_text.png").convert("RGBA")
    background.paste(comparing_text, (100, 730), comparing_text)
    background.paste(my_district_text, (1345, 763), my_district_text)

    # Get box plot image and add to background
    plots_pic = Image.open(directory + '/{}_plots.png'.format(district))
    background.paste(plots_pic, (512, 683), plots_pic)

    draw = ImageDraw.Draw(background)
    # Draw divider line
    draw.rectangle((
        102,
        675,
        1498,
        677
    ), fill=grey)

    # Create folder for district if there isn't one already
    directory = output_dir + district
    if not os.path.exists(directory):
        os.makedirs(directory)
    background.save(directory + '/{}_share_image.png'.format(district))


# Get turnout data (from gen_turnout_json.py run)
# To be used for percent plots and grade
with open('./parsed_data/turnout_by_district.json', 'r') as f:
    turnout_data = json.loads(f.read())
overall_percent = float(turnout_data['overall_data']['avg_percent_2014'])

districts = [x for x in turnout_data.keys() if x != 'overall_data']
districts.sort()

# STEP 1
# Generate map screenshots
# Map screenshots are saved in a seperate folder ed_map_screenshots
# This allows them to be easily QAed (visually / manually) *recommended

# Make directory to save images (if it doesn't already exist)
ed_map_screenshots_dir = image_dir + 'ed_map_screenshots'
if not os.path.exists(ed_map_screenshots_dir):
    os.makedirs(ed_map_screenshots_dir)

# Create a list of districts that need map images
map_image_needed = []
for district in districts:
    # Get a list of districts that need map screenshots
    if not os.path.isfile(ed_map_screenshots_dir + '/map_{}.png'.format(district)):
        map_image_needed.append(district)

# # It is a good idea to visually QA the image icons and make sure they images look good
# # before adding map screenshots to share images (STEP 4)

# Every run of gen_map_screenshots will add 100 images
# get number of run times:
rerun_count = math.ceil(len(map_image_needed)/100)
# Because of a bug in the pyppeteer library that does not properly close browser
# If we run for all districts, we get an error "Too Many Open Files"
# A workaround is to run an external script in batches
if len(map_image_needed) > 0:
    print("Running script to generate screenshots of map...")
for i in range(rerun_count):
    subprocess.call(["python3", "gen_map_screenshot.py"])
    print("Finished batch {part} out of {whole}".format(part=i+1, whole=rerun_count))


# Now generate percent plots and share images
for district in districts:
    directory = output_dir + district
    # Make folders if they don't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # STEP 2
    # Generate box plots
    # Saved as a separate file for use on district url and in share image
    if not os.path.isfile(directory + '/{}_plots.png'.format(district)):
        district_percent = turnout_data[district]['percent']
        save_boxplots(district, district_percent, overall_percent)

    # STEP 3
    # Generate and save share images
    if not os.path.isfile(directory + '/{}_share_image.png'.format(district)):
        grade = turnout_data[district]['grade'].replace("+", "Plus").replace("-", "Minus")
        district_percent = turnout_data[district]['percent']
        draw_and_save_img(district, grade, district_percent, overall_percent)
        print("Share image complete for ", district)
