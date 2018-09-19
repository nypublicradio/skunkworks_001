from PIL import Image, ImageDraw, ImageFont


image_dir = './image_generation_parts/'
hex_codes_2 = ['#08589e', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#f0f9e8', '#ffffff']
grades = ['A+', 'A', 'B', 'C', 'D', 'F', 'F-', 'N/A']

# convert hex to rgb https://www.rgbtohex.net/hextorgb/
hex_to_rgb = {
    '#08589e': (8,88,158),
    '#2b8cbe': (43,140,190),
    '#4eb3d3': (78,179,211),
    '#7bccc4': (123,204,196),
    '#a8ddb5': (168,221,181),
    '#ccebc5': (204,235,197),
    '#f0f9e8': (240,249,232),
    '#ffffff': (255,255,255)
}

charcoal = (51, 51, 51)
box_size = 24
border_size = 1
margin = 10
background_size = (215, 57)
font = ImageFont.truetype(image_dir + "OpenSans-Regular.ttf", 12)

background = Image.open(image_dir + "background.png")
background = background.resize(background_size)
draw = ImageDraw.Draw(background)

# Draw horizontal legend
# draw outer rectangle (charcoal)
draw.rectangle((margin, margin, margin + 8*box_size + 2*border_size, margin + box_size + 2*border_size), fill=charcoal)
for i, color in enumerate(hex_codes_2):
    # draw colored box
    x = margin + i*(box_size) + border_size
    y = margin + border_size
    draw.rectangle((x, y, x + box_size, y + box_size), fill=hex_to_rgb[color])
    # add key (corresponding grade)
    draw.text((x + box_size/4, y + box_size + 1), grades[i], charcoal, font=font)

background.save('./legend.png')



