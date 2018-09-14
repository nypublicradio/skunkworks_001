from PIL import Image, ImageDraw, ImageFont
import os

overall_percent = 20
image_dir = './image_generation_parts/'

def draw_and_save_img(district, grade, district_percent):
    # Add emoji_image
    background = Image.open(image_dir + "background.png")
    emoji_img = Image.open(image_dir + "Emoji_Grade_Images/-g-All-{}.png".format(grade)).convert("RGBA")
    background.paste(emoji_img, (100, 300), emoji_img)

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
    color_width1 = 600
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
    color_width2 = 700
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


district = 51001
grade = "APlus"
district_percent = 65

# iterate through all districts


draw_and_save_img(district, grade, district_percent)

