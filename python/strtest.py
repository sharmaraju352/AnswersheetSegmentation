import glob

output_folder="../output2"
seat_number="S0124"

def getPageNumber(question):
    outputFiles = glob.glob(output_folder+"/*.jpg")
    if(len(outputFiles)>0):
        for file in outputFiles:
            if(question in file):
                return (int(file[15+len(seat_number):-4])+1)
        return 1
    else:
        return 1

print(getPageNumber('Q6'))