import asyncio
import json
import os
import sys

from pyppeteer import launch


image_dir = './image_generation_parts/'

# This script is run by gen_images.py
# to take screenshots of the voter turnout map for each district

async def take_screenshot(district):
    browser = await launch(headless=True, autoClose=True)
    page = await browser.newPage()
    await page.goto(
        'http://localhost:3000/{}'.format(district),
        {'timeout': 0}
    )
    await asyncio.sleep(3)
    filepath = image_dir + '/ed_map_screenshots/map_{}.png'.format(district)
    await page.screenshot(
        {
            'path': filepath,
            'clip': {
                'x': 0,
                'y': 177,
                'width': 800,
                'height': 349
            }
        }
    )
    # Note : Values for x, y, width, and height may change
    #        if placement of the map changes on page
    await page.close()
    await browser.close()


def take_screenshots(districts):
    loop = asyncio.get_event_loop()
    futures = [asyncio.ensure_future(take_screenshot(district)) for district in districts]
    loop.run_until_complete(asyncio.gather(*futures))


# Get districts from turnout data
with open('./parsed_data/turnout_by_district.json', 'r') as f:
    turnout_data = json.loads(f.read())
districts = [x for x in turnout_data.keys() if x != 'overall_data']
districts.sort()

# Get a list of districts that need map screenshots
map_image_needed = []
for district in districts:
    if not os.path.isfile(image_dir + 'ed_map_screenshots/map_{}.png'.format(district)):
        map_image_needed.append(district)

batch_size = 10
num_batches = 10
# only takes 100 screenshots
for i in range(0, num_batches*batch_size, batch_size):
    print("Taking screenshots for: {}".format(", ".join(map_image_needed[i: i+batch_size])))
    take_screenshots(map_image_needed[i: i + batch_size])
