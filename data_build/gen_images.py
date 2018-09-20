import json
import os
import os.path
import sys
import time

import asyncio
import time
from pyppeteer import launch


from PIL import Image, ImageDraw, ImageFont
from selenium import webdriver
from depot.manager import DepotManager


"""
This is a script to generate the images used for sharing.
Images are saved as src/static/<district_number>/share_image.png
The map view of the district is generated using phantomjs and selenium
to screenshot a cropped map displayed on the url: http://localhost:3000/<district_number>/ for each district.
Using data in turnout_by_district.json:
    The plots are generated using the percent turnout
    The emoji and grade are chosen from the folder based on the grade

To run this script:

npm install
npm run build
npm run watch

Make the following changes to map.js

    // .duration(750)                               <-- change duration value
    .duration(0)

    if (d && this.centered !== d) {
      var centroid = this.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      // k = 4;                                     <-- change magnification factor
      k = 2.2;

python3 gen_images.py
"""

image_dir = './image_generation_parts/'
grey = (223, 223, 223)
charcoal = (51, 51, 51)
blue = (30, 102, 202)


async def take_screenshot(district):
    browser = await launch(headless=True)
    page = await browser.newPage()
    await page.goto(
        'http://localhost:3000/{}'.format(district),
        {
            # 'networkIdleTimeout': 5000,
            # 'waitUntil': 'networkidle',
            'timeout': 0
        }

    )
    time.sleep(3)
    await page.screenshot(
        {
            'path': image_dir + '/ed_map_screenshots/map_{}.png'.format(district),
            'clip': {
                'x': 0 ,
                'y': 177,
                'width': 800 ,
                'height': 349
            }
        }
    )
    await browser.close()


def take_screenshots(districts):
    tasks = []
    loop = asyncio.new_event_loop()
    for district in districts:
        tasks.append(loop.create_task(take_screenshot(district)))

    loop.run_until_complete(asyncio.wait(tasks))
    loop.close()


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
    district_percent_text = '%g'%(round(district_percent, 1))
    draw.text((corner_x + color_width1 -10, corner_y - 75), "{}%".format(district_percent_text), charcoal, font=font)

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
    overall_percent_text = '%g'%(round(overall_percent, 1))
    draw.text((corner_x + color_width2 - 10, corner2_y + 108), "{}%".format(overall_percent_text), charcoal, font=font)
    # save file
    directory = '../src/static/{}'.format(district)
    chart_background.save(directory + '/{}_plots.png'.format(district))


def draw_and_save_img(district, grade, district_percent, overall_percent):
    """ Gernerates the share image and saves image to the district folder
    """
    directory = '../src/static/{}'.format(district)

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
    directory = '../src/static/{}'.format(district)
    if not os.path.exists(directory):
        os.makedirs(directory)
    background.save(directory + '/{}_share_image.png'.format(district))

with open('./parsed_data/turnout_by_district.json', 'r') as f:
    turnout_data = json.loads(f.read())
overall_percent = float(turnout_data['overall_data']['avg_percent_2014'])

# Iterate through all districts in turnout_data:
districts = [x for x in turnout_data.keys() if x!= 'overall_data']
districts.sort()



# STEP 1
# Generate map screenshots
map_image_needed = []
for district in districts:
    directory = '../src/static/{}'.format(district)
    # Make folders if they don't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Get a list of districts that need map screenshots
    if not os.path.isfile(image_dir + 'ed_map_screenshots/map_{}.png'.format(district)):
        map_image_needed.append(district)

# Generate map screenshots to be used in share images
# It is a good idea to visually QA the image icons and make sure they images look good
# before adding map screenshots to share images (STEP 4)
batch_size = 10
for i in range(0, len(map_image_needed), batch_size):
    print(map_image_needed[i: i+batch_size])
    take_screenshots(map_image_needed[i: i+batch_size])


# STEP 2

# for district in districts[:5]:
#     district_percent = turnout_data[district]['percent']

    # if not os.path.isfile(image_dir + 'ed_map_screenshots/map_{}.png'.format(district)):
    #     print(district)
    #     # Check that k has been reset - runs every time in case code is updated while script is running
    #     with open('../src/js/map.js', 'r') as f:
    #         map_file = f.read()
    #     k = map_file.split("k =")[1].split(";")[0].strip(" ")
    #     if k != '2.2':
    #         sys.exit("Make sure to reset k = 2.2 in map.js file")
    #     save_cropped_map_image(district)

    # # STEP 3
    # # Generate box plots
    # # Saved as a separate file for use on district url and in share image
    # if not os.path.isfile(directory + '/{}_plots.png'.format(district)):
    #     save_boxplots(district, district_percent, overall_percent)

    # # STEP 4
    # # Generate and save share images
    # if not os.path.isfile(directory + '/{}_share_image.png'.format(district)):
    #     print(district)
    #     grade = turnout_data[district]['grade'].replace("+", "Plus").replace("-", "Minus")
    #     print(grade)
    #     draw_and_save_img(district, grade, district_percent, overall_percent)

