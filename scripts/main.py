from datetime import datetime
import os
import exifread
import pickle
import time

import plotly.express as px
import pandas as pd

def plot_images(image_groups):
    data = {"Lat": [], "Long": [], "Name": [], "Group": [], "Time": []}
    color_scale = [(0, "orange"), (1, "red")]

    for group_no, image_data in enumerate(image_groups):
        for img in image_data:
            data["Lat"].append(img["latitude"])
            data["Long"].append(img["longitude"])
            data["Name"].append(os.path.basename(img["path"]))
            data["Group"].append(group_no)
            data["Time"].append(time.mktime(img["time"].timetuple()))

    df = pd.DataFrame(data)

    fig = px.scatter_mapbox(df, 
                            lat="Lat", 
                            lon="Long", 
                            hover_name="Name", 
                            hover_data=["Lat", "Long", "Group", "Time"],
                            color="Time",
                            color_continuous_scale=color_scale,
                            zoom=14, 
                            height=800,
                            width=800)

    fig.update_layout(mapbox_style="open-street-map")
    fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
    fig.show()



def get_exif_data(image_path):
    with open(image_path, "rb") as f:
        tags = exifread.process_file(f)

        lat = tags["GPS GPSLatitude"]
        lon = tags["GPS GPSLongitude"]

        lat_ref = tags["GPS GPSLatitudeRef"]
        lon_ref = tags["GPS GPSLongitudeRef"]

        # Degrees + Minutes/60 + Seconds/3600
        deci_lat = float(lat.values[0] + (lat.values[1] / 60) + (lat.values[2] / 3600))
        deci_lon = float(lon.values[0] + (lon.values[1] / 60) + (lon.values[2] / 3600))

        if lat_ref.values[0] == "S":
            deci_lat *= -1
        
        if lon_ref.values[0] == "W":
            deci_lon *= -1

        exif_time = tags["EXIF DateTimeOriginal"].values
        time = datetime.strptime(exif_time, '%Y:%m:%d %H:%M:%S')

        return {
            "latitude": deci_lat,
            "longitude": deci_lon,
            "time": time
        }
        

def get_file_extension(path):
    return path.split(".")[-1].lower()

def get_all_files(path, types = ["jpg", "jpeg"]):
    all_files = []
    
    for root, dirs, files in os.walk(path):
        for file in files:
            path = os.path.join(root, file)
            
            if get_file_extension(path) in types:
                all_files.append(path)
    
    return all_files

def find_next_img(current, remaining):
    max_dist = (1 / 364000) * 30
    max_time = 60 * 5

    closest = []
    for img in remaining:
        pass

if __name__ == "__main__":
    # image_dir = '/mnt/c/Users/william/Desktop/Dronebase 1-12'
    # image_files = get_all_files(image_dir)
    # image_data = []

    # total = len(image_files)

    # for idx, img in enumerate(image_files):
    #     exif_data = get_exif_data(img)
    #     image_data.append({
    #         "path": img,
    #         **exif_data
    #     })

    #     print(int(idx / total * 100), img, exif_data["latitude"], exif_data["longitude"])
    
    # with open("image_data.pickle", "wb") as f:
    #     pickle.dump(image_data, f)

    with open("image_data.pickle", "rb") as f:
        image_data = pickle.load(f)
    
    print(image_data)

    plot_images([image_data])

    # group = []

    # current = image_data[0]

    # while True:
    #     for img in image_data[1:]:


    # plot_images([image_data[:500], image_data[500:]])