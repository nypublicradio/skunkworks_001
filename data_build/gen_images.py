from PIL import Image, ImageDraw, ImageFont
import os
from selenium import webdriver
from depot.manager import DepotManager
import time

overall_percent = 23.2
image_dir = './image_generation_parts/'



def save_screenshot(district):
    depot = DepotManager.get()
    driver = webdriver.PhantomJS()
    # driver = webdriver.PhantomJS(executable_path='Complete path/to/phantomjs.exe')
    # driver = webdriver.PhantomJS(executable_path='node_modules/phantomjs')
    driver.set_window_size(1024, 768) # set the window size that you need
    driver.get('http://localhost:3000/{}/'.format(district))
    time.sleep(2)
    driver.save_screenshot('./image_generation_parts/screenshot.png')

def draw_and_save_img(district, grade, district_percent):
    # Add emoji_image
    background = Image.open(image_dir + "background.png")
    emoji_img = Image.open(image_dir + "Emoji_Grade_Images/-g-All-{}.png".format(grade)).convert("RGBA")
    background.paste(emoji_img, (100, 300), emoji_img)

    # add map
    map_pic = Image.open(image_dir + 'screenshot.png').convert("RGBA")
    area = (0, 160, 960, 660)
    cropped_img = map_pic.crop(area)

    # resize image
    basewidth = 700
    wpercent = (basewidth/float(cropped_img.size[0]))
    hsize = int((float(cropped_img.size[1])*float(wpercent)))
    cropped_img = cropped_img.resize((basewidth,hsize), Image.ANTIALIAS)

    background.paste(cropped_img, (700, 300), cropped_img)


    #Add static text
    my_block_text = Image.open(image_dir + "my_block_text.png").convert("RGBA")
    comparing_text = Image.open(image_dir + "comparing_turnout_text.png").convert("RGBA")
    background.paste(comparing_text, (100, 730), comparing_text)
    background.paste(my_block_text, (1350, 755), my_block_text)

    # Draw box plots
    draw = ImageDraw.Draw(background)

    box_w, box_h = 800, 70
    grey = (223, 223, 223)
    corner_x = 533
    corner1_y = 760
    color_width1 = 8*district_percent
    line_width = 3
    # First bar (how your district did)
    draw.rectangle((corner_x, corner1_y, corner_x + box_w, corner1_y + box_h), fill=grey)
    draw.rectangle((corner_x, corner1_y, corner_x + color_width1, corner1_y + box_h), fill=(30,102,202))
    # draw little line
    draw.rectangle((
        corner_x + color_width1,
        corner1_y - 35,
        corner_x + color_width1 + line_width,
        corner1_y + box_h
    ), fill=(51,51,51))
    # add percent text
    draw = ImageDraw.Draw(background)
    font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 24)
    draw.text((corner_x + color_width1 -10, corner1_y - 75),"{}%".format(district_percent), (51, 51, 51), font=font)

    # Second bar
    corner2_y = corner1_y + box_h + 14
    color_width2 = 8 * overall_percent
    draw.rectangle((corner_x, corner2_y, corner_x + box_w, corner2_y + box_h), fill=grey)
    draw.rectangle((corner_x, corner2_y, corner_x + color_width2, corner2_y + box_h), fill=(51, 51, 51))
    # draw little line
    draw.rectangle((
        corner_x + color_width2,
        corner2_y,
        corner_x + color_width2 + line_width,
        corner2_y + box_h + 35
    ), fill=(51, 51, 51))
    # add percent text
    draw = ImageDraw.Draw(background)
    font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 24)
    draw.text((corner_x + color_width2 - 10, corner2_y + 108),"{}%".format(overall_percent), (51, 51, 51), font=font)

    # create folder for district if there isn't one already
    directory = '../src/static/{}'.format(district)
    if not os.path.exists(directory):
        os.makedirs(directory)
    background.save(directory + '/share_image.png'.format(district))


district = 53002
grade = "FMinus"
district_percent = 65

# iterate through all districts

save_screenshot(district)
draw_and_save_img(district, grade, district_percent)

