import cv2
import numpy as np
from matplotlib import pyplot as plt
import glob
import mysql.connector
import sys
from PIL import Image
import base64
from io import StringIO
import PIL.Image
from pdf2image import convert_from_path, convert_from_bytes
import os

input_folder="input2"
output_folder="output2"
template_folder="templates2"

seat_number = sys.argv[1]

pages = convert_from_path("../uploaded_files/"+seat_number,dpi=200, output_folder=input_folder, first_page=None, last_page=None, fmt='jpg')
for filename in os.listdir(input_folder): 
	os.rename(input_folder+"/"+filename, input_folder+"/"+filename[-5:]) 

templateFiles=glob.glob(template_folder+"/*.jpg")
sampleFiles=glob.glob(input_folder+"/*.jpg")

sampleFiles.sort()

seat_number = seat_number[:-4]

for sampleFile in sampleFiles:
	img_rgb = cv2.imread(sampleFile)
	sample_height, sample_width = img_rgb.shape[:2]
	img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)

	locationAndQuestion=[]
	location=[]
	for templateFile in templateFiles:
		template = cv2.imread(templateFile,0)
		w, h = template.shape[::-1]
		question=templateFile[19:-6]
		res = cv2.matchTemplate(img_gray,template,cv2.TM_CCOEFF_NORMED)
		threshold = 0.8
		loc = np.where( res >= threshold)
		y=0
		tempList=[]
		for pt in zip(*loc[::-1]):
			y=pt[1]	
		if(y!=0):
			location.append(y)
			tempList.append(y)
			tempList.append(question)
			locationAndQuestion.append(tempList)

	location.append(sample_height)
	location.sort()

	for i in range(len(location)):
		for a in locationAndQuestion:
			if(a[0]==location[i]):
				crop_img = img_rgb[location[i]:location[i+1], 0:sample_width]
				cv2.imwrite(output_folder+"/"+seat_number+a[1]+".jpg", crop_img)



