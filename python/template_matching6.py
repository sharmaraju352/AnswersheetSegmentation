import cv2
import numpy as np
from matplotlib import pyplot as plt
import glob
import sys
from PIL import Image
import base64
from io import StringIO
import PIL.Image
from pdf2image import convert_from_path, convert_from_bytes
import os

input_folder="../input2"
output_folder="../output2"
template_folder="../templates2"

seat_number = sys.argv[1]

# pages = convert_from_path("../uploaded_files/"+seat_number,dpi=200, output_folder=input_folder, first_page=None, last_page=None, fmt='jpg')

# for filename in os.listdir(input_folder): 
# 	os.rename(input_folder+"/"+filename, input_folder+"/"+filename[-6:]) 

templateFiles=glob.glob(template_folder+"/*.jpg")
sampleFiles=glob.glob(input_folder+"/*.jpg")


sampleFiles.sort()
question=''
seat_number = seat_number[:-4]

def getPageNumber(question):
    outputFiles = glob.glob(output_folder+"/*.jpg")
    if(len(outputFiles)>0):
        for file in outputFiles:
            if(question in file):
                return (int(file[15+len(seat_number):-4])+1)
        return 1
    else:
        return 1


for sampleFile in sampleFiles:
	img_rgb = cv2.imread(sampleFile)
	img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)

	didMatchWithAtleastOneTemplate=False

	for templateFile in templateFiles:

		template = cv2.imread(templateFile,0)
		w, h = template.shape[::-1]

		res = cv2.matchTemplate(img_gray,template,cv2.TM_CCOEFF_NORMED)
		threshold = 0.8
		loc = np.where( res >= threshold)

		arr1=loc[0]
		if not arr1.any():
			pass
		else: 
			didMatchWithAtleastOneTemplate=True
			fileName=sampleFile[10:-4]
			question=templateFile[23:-6]
			filename=output_folder+"/"+seat_number+"_"+question+"_"+str(getPageNumber(question))+".jpg"
			print(filename)
			cv2.imwrite(filename,img_rgb)
			

	if(not didMatchWithAtleastOneTemplate):
			notMatchedCount=notMatchedCount+1
			fileName=sampleFile[10:-4]
			filename=output_folder+"/"+seat_number+"_"+question+"_"+str(getPageNumber(question))+".jpg"
			print(filename)
			cv2.imwrite(filename,img_rgb)
	didMatchWithAtleastOneTemplate=False


		
