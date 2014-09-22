multipleCsvToJsonGmapMarkers
============================
*This plug-in reads multiple csv files under the same domain, convert it into json and then appends markers into gmap.
*Every csv is a category of marks ex:shops,services...
*Finally plug-in appends a navigation that you can toggle your markers.

*The path of csv files is declered as variable in the domain with the img path, the width of the img and the name of the category
Please note that the plug-in also offers a feuture to controll the img of your category.Your category made can have the status of: active service and inactive.
And this is controled by the table UPDATED.The plug-in automatecly build the image name with in character ex: imageName the incative version will be inimageName
For exaple:

http://www.myDomain.com/index.html?url:./csv/shops.csv&img:./img/shop.png&dim:20&category:shop&url:./csv/service.csv&img:./img/service.png&dim:20&category:service


 
