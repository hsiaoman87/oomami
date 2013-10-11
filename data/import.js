var categoriesCursor = db.categories.find();
while (categoriesCursor.hasNext()) {
    var category = categoriesCursor.next();
    
    var images = [];
    var imagesCursor = db.categoryimages.find({ categoryId: category.categoryId });
    while (imagesCursor.hasNext()) {
        var image = imagesCursor.next();
        images.push(image._id);
    }
    category.images = images;
    
    var yelpCategories = [];
    var yelpCategoriesCursor = db.yelpcategories.find({ categoryId: category.categoryId });
    while (yelpCategoriesCursor.hasNext()) {
        var yelpCategory = yelpCategoriesCursor.next();
        yelpCategories.push(yelpCategory._id);
    }
    category.yelpCategories = yelpCategories;
    
    db.categories.save(category);
}