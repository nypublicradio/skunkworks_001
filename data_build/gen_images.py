import json
import os
import os.path
import time

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

def save_screenshot(district):
    depot = DepotManager.get()
    driver = webdriver.PhantomJS()
    driver.set_window_size(1024, 768) # set the window size that you need
    driver.get('http://localhost:3000/{}/'.format(district))
    time.sleep(5)
    driver.save_screenshot('./image_generation_parts/screenshot.png')


def save_cropped_map_image(district):
    save_screenshot(district)
    # add map
    map_pic = Image.open(image_dir + 'screenshot.png').convert("RGBA")
    area = (113, 166, 913, 526)
    cropped_img = map_pic.crop(area)
    # resize map image
    basewidth = 800
    wpercent = (basewidth/float(cropped_img.size[0]))
    hsize = int((float(cropped_img.size[1])*float(wpercent)))
    cropped_img = cropped_img.resize((basewidth, hsize), Image.ANTIALIAS)
    cropped_img.save(image_dir + '/ed_map_screenshots/map_{}.png'.format(district))


def draw_boxplots(district, district_percent, overall_percent, base_image, corner_x, corner_y):
    # Draw box plots
    draw = ImageDraw.Draw(base_image)

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
    draw = ImageDraw.Draw(base_image)
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
    draw = ImageDraw.Draw(base_image)
    font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 24)
    overall_percent_text = '%g'%(round(overall_percent, 1))
    draw.text((corner_x + color_width2 - 10, corner2_y + 108), "{}%".format(overall_percent_text), charcoal, font=font)


def draw_and_save_img(district, grade, district_percent, overall_percent):
    # Add emoji_image
    background = Image.open(image_dir + "background.png")
    emoji_img = Image.open(image_dir + "Emoji_Grade_Images/-g-All-{}.png".format(grade)).convert("RGBA")
    background.paste(emoji_img, (130, 230), emoji_img)

    # get map image and add to background
    map_pic = Image.open(image_dir + '/ed_map_screenshots/map_{}.png'.format(district))
    background.paste(map_pic, (670, 250), map_pic)

    #Add static text
    my_district_text = Image.open(image_dir + "my_district_text.png").convert("RGBA")
    comparing_text = Image.open(image_dir + "comparing_turnout_text.png").convert("RGBA")
    background.paste(comparing_text, (100, 730), comparing_text)
    background.paste(my_district_text, (1345, 763), my_district_text)

    corner_x = 533
    corner_y = 760
    draw_boxplots(district, district_percent, overall_percent, background, corner_x, corner_y)

    draw = ImageDraw.Draw(background)
    # draw divider line
    draw.rectangle((
        102,
        675,
        1498,
        677
    ), fill=grey)

    # create folder for district if there isn't one already
    directory = '../src/static/{}'.format(district)
    if not os.path.exists(directory):
        os.makedirs(directory)
    background.save(directory + '/share_image.png')

with open('turnout_by_district.json', 'r') as f:
    turnout_data = json.loads(f.read())
    overall_percent = float(turnout_data['overall_data']['avg_percent_2014'])

# iterate through all districts
# for district in turnout_data:
districts = [x for x in turnout_data.keys() if x!= 'overall_data']
districts.sort()


for district in districts:
    district_percent = turnout_data[district]['percent']
    directory = '../src/static/{}'.format(district)

    # Generate map screenshots to be used in share images
    # It is a good idea to visually QA the image icons and make sure they images look good
    # before adding map screenshots to share images
    if not os.path.isfile(image_dir + '/ed_map_screenshots/map_{}.png'.format(district)):
        save_cropped_map_image(district)

    # Generate box plots
    # Saved as a separate file for use on district url and in share image
    # if not os.path.isfile(directory + '/{}_plots.png'.format(district)):
    #     background = Image.open(image_dir + "background.png")
    #     chart_background = background.resize((844, 310))
    #     # save boxplots image
    #     draw_boxplots(district, district_percent, overall_percent, chart_background, 21, 77)

    #     if not os.path.exists(directory):
    #         os.makedirs(directory)
    #     chart_background.save(directory + '/{}_plots.png'.format(district))
    #     print(district, "saved plots")

    # if not os.path.isfile('../src/static/{}/share_image.png'.format(district)):
    #     print(district, "adding share image")
    #     grade = turnout_data[district]['grade']
    #     grade = grade.replace("+", "Plus")
    #     grade = grade.replace("-", "Minus")

    #     save_screenshot(district)
    #     draw_and_save_img(district, grade, district_percent, overall_percent)

