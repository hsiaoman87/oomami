mongo my_database --eval "db.categories.remove()"
mongo my_database --eval "db.categoryimages.remove()"
mongo my_database --eval "db.yelpcategories.remove()"
mongoimport -d my_database -c categories --type csv -file data\Categories.csv --headerline
mongoimport -d my_database -c categoryimages --type csv -file data\CategoryImages.csv --headerline
mongoimport -d my_database -c yelpcategories --type csv -file data\YelpCategories.csv --headerline
mongo my_database data\import.js

supervisor -w . app.js