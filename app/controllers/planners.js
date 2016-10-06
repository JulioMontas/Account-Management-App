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

//build the REST operations at the base for planners
//this will be accessible from http://127.0.0.1:3000/planners if the default route for / is left unchanged
router.route('/')
    //GET all planners
    .get(function(req, res, next) {
        //retrieve all planners from Monogo
        mongoose.model('Planner').find({}, function (err, planners) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/planners folder. We are also setting "planners" to be an accessible variable in our ejs view
                    html: function(){
                        res.render('planners/index', {
                              title: 'planner Manager',
                              summary: 'Organize and search for seeking PW',
                              "planners" : planners
                          });
                    },
                    //JSON response will show all planners in JSON format
                    json: function(){
                        res.json(planners);
                    }
                });
              }
        });
    })
    //POST a new planner
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var username = req.body.username;
        var email = req.body.email;
        var planner = req.body.planner;
        var summary = req.body.summary;
        var company_url = req.body.company_url;
        var category = req.body.category;
        var company = req.body.company;
        var pay_subscription = req.body.pay_subscription;
        var pin = req.body.pin;
        var year = req.body.year;
        var task_list = req.body.task_list;
        var created_at = req.body.created_at;
        var updated_at = req.body.updated_at;
        //call the create function for our database
        mongoose.model('Planner').create({
            username: username,
            email: email,
            planner: planner,
            summary: summary,
            company_url: company_url,
            category: category,
            company: company,
            pay_subscription: pay_subscription,
            pin: pin,
            year: year,
            task_list: task_list,
            created_at: created_at,
            updated_at: updated_at
        }, function (err, planner) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //planner has been created
                  console.log('POST creating new planner: ' + planner);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("planners");
                        // And forward to success page
                        res.redirect("/planners");
                    },
                    //JSON response will show the newly created planner
                    json: function(){
                        res.json(planner);
                    }
                });
              }
        })
    });

/* GET New planner page. */
router.get('/new', function(req, res) {
    res.render('planners/new', { title: 'Add New planner' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Planner').findById(id, function (err, planner) {
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
            //console.log(planner);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Planner').findById(req.id, function (err, planner) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + planner._id);
        var plannercreated_at = planner.created_at.toISOString();
        plannercreated_at = plannercreated_at.substring(0, plannercreated_at.indexOf('T'));

        var plannerupdated_at = planner.updated_at.toISOString();
        plannerupdated_at = plannerupdated_at.substring(0, plannerupdated_at.indexOf('T'));
        res.format({
          html: function(){
              res.render('planners/show', {
                "plannercreated_at" : plannercreated_at,
                "plannerupdated_at" : plannerupdated_at,
                "planner" : planner
              });
          },
          json: function(){
              res.json(planner);
          }
        });
      }
    });
  });

//GET the individual planner by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the planner within Mongo
    mongoose.model('Planner').findById(req.id, function (err, planner) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the planner
            console.log('GET Retrieving ID: ' + planner._id);
            //format the date properly for the value to show correctly in our edit form
            var plannercreated_at = planner.created_at.toISOString();
            plannercreated_at = plannercreated_at.substring(0, plannercreated_at.indexOf('T'))

            var plannerupdated_at = planner.updated_at.toISOString();
            plannerupdated_at = plannerupdated_at.substring(0, plannerupdated_at.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.hbs' template
                html: function(){
                       res.render('planners/edit', {
                          title: 'planner' + planner._id,
                          "plannercreated_at" : plannercreated_at,
                          "plannerupdated_at" : plannerupdated_at,
                          "planner" : planner
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(planner);
                 }
            });
        }
    });
});

//PUT to update a planner by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var username = req.body.username;
    var email = req.body.email;
    var planner = req.body.planner;
    var summary = req.body.summary;
    var company_url = req.body.company_url;
    var category = req.body.category;
    var company = req.body.company;
    var pay_subscription = req.body.pay_subscription;
    var pin = req.body.pin;
    var year = req.body.year;
    var task_list = req.body.task_list;
    var created_at = req.body.created_at;
    var updated_at = req.body.updated_at;
   //find the document by ID
        mongoose.model('Planner').findById(req.id, function (err, planner) {
            //update it
            planner.update({
              username: username,
              email: email,
              planner: planner,
              summary: summary,
              company_url: company_url,
              category: category,
              company: company,
              pay_subscription: pay_subscription,
              pin: pin,
              year: year,
              task_list: task_list,
              created_at: created_at,
              updated_at: updated_at
            }, function (err, plannerID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/planners/" + planner._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(planner);
                         }
                      });
               }
            })
        });
});

//DELETE a planner by ID
router.delete('/:id/edit', function (req, res){
    //find planner by ID
    mongoose.model('Planner').findById(req.id, function (err, planner) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            planner.remove(function (err, planner) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + planner._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/planners");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({
                                 message : 'deleted',
                                 item : planner
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
