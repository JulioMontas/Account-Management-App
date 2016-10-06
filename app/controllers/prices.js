var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

// copied from method override page
router.use(bodyParser.urlencoded({ extended: true }));

router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for prices
//this will be accessible from http://127.0.0.1:3000/prices if the default route for / is left unchanged
router.route('/')
    //GET all prices
    .get(function(req, res, next) {
        //retrieve all prices from Monogo
        mongoose.model('Price').find({}, function (err, prices) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/prices folder. We are also setting "prices" to be an accessible variable in our ejs view
                    html: function(){
                        res.render('prices/index', {
                              title: 'Pricing Skills',
                              summary: 'To see your rates better',
                              "prices" : prices
                          });
                    },
                    //JSON response will show all prices in JSON format
                    json: function(){
                        res.json(prices);
                    }
                });
              }
        });
    })
    //POST a new price
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var skill = req.body.skill;
        var perProjectHigh = req.body.perProjectHigh;
        var perProjectLow = req.body.perProjectLow;
        var perHourHigh = req.body.perHourHigh;
        var perHourLow = req.body.perHourLow;
        var category = req.body.category;
        var created_at = req.body.created_at;
        var updated_at = req.body.updated_at;
        //call the create function for our database
        mongoose.model('Price').create({
            skill: skill,
            perProjectHigh: perProjectHigh,
            perProjectLow: perProjectLow,
            perHourHigh: perHourHigh,
            perHourLow: perHourLow,
            category: category,
            created_at: created_at,
            updated_at: updated_at
        }, function (err, price) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //price has been created
                  console.log('POST creating new price: ' + price);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("prices");
                        // And forward to success page
                        res.redirect("/prices");
                    },
                    //JSON response will show the newly created price
                    json: function(){
                        res.json(price);
                    }
                });
              }
        })
    });

/* GET New price page. */
router.get('/new', function(req, res) {
    res.render('prices/new', { title: 'Add New price' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Price').findById(id, function (err, price) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(price);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Price').findById(req.id, function (err, price) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + price._id);
        var pricecreated_at = price.created_at.toISOString();
        pricecreated_at = pricecreated_at.substring(0, pricecreated_at.indexOf('T'));

        var priceupdated_at = price.updated_at.toISOString();
        priceupdated_at = priceupdated_at.substring(0, priceupdated_at.indexOf('T'));
        res.format({
          html: function(){
              res.render('prices/show', {
                "pricecreated_at" : pricecreated_at,
                "priceupdated_at" : priceupdated_at,
                "price" : price
              });
          },
          json: function(){
              res.json(price);
          }
        });
      }
    });
  });

//GET the individual price by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the price within Mongo
    mongoose.model('Price').findById(req.id, function (err, price) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the price
            console.log('GET Retrieving ID: ' + price._id);
            //format the date properly for the value to show correctly in our edit form
            var pricecreated_at = price.created_at.toISOString();
            pricecreated_at = pricecreated_at.substring(0, pricecreated_at.indexOf('T'))

            var priceupdated_at = price.updated_at.toISOString();
            priceupdated_at = priceupdated_at.substring(0, priceupdated_at.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.hbs' template
                html: function(){
                       res.render('prices/edit', {
                          title: 'price' + price._id,
                          "pricecreated_at" : pricecreated_at,
                          "priceupdated_at" : priceupdated_at,
                          "price" : price
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(price);
                 }
            });
        }
    });
});

//PUT to update a price by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var skill = req.body.skill;
    var perProjectHigh = req.body.perProjectHigh;
    var perProjectLow = req.body.perProjectLow;
    var perHourHigh = req.body.perHourHigh;
    var perHourLow = req.body.perHourLow;
    var category = req.body.category;
    var created_at = req.body.created_at;
    var updated_at = req.body.updated_at;
   //find the document by ID
        mongoose.model('Price').findById(req.id, function (err, price) {
            //update it
            price.update({
              skill: skill,
              perProjectHigh: perProjectHigh,
              perProjectLow: perProjectLow,
              perHourHigh: perHourHigh,
              perHourLow: perHourLow,
              category: category,
              created_at: created_at,
              updated_at: updated_at
            }, function (err, priceID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/prices/" + price._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(price);
                         }
                      });
               }
            })
        });
});

//DELETE a price by ID
router.delete('/:id/edit', function (req, res){
    //find price by ID
    mongoose.model('Price').findById(req.id, function (err, price) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            price.remove(function (err, price) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + price._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/prices");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({
                                 message : 'deleted',
                                 item : price
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
