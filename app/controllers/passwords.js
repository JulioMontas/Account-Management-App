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

//build the REST operations at the base for passwords
//this will be accessible from http://127.0.0.1:3000/passwords if the default route for / is left unchanged
router.route('/')
    //GET all passwords
    .get(function(req, res, next) {
        //retrieve all passwords from Monogo
        mongoose.model('Password').find({}, function (err, passwords) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/passwords folder. We are also setting "passwords" to be an accessible variable in our ejs view
                    html: function(){
                        res.render('passwords/index', {
                              title: 'Password Manager',
                              summary: 'Organize and search for seeking PW',
                              "passwords" : passwords
                          });
                    },
                    //JSON response will show all passwords in JSON format
                    json: function(){
                        res.json(passwords);
                    }
                });
              }
        });
    })
    //POST a new password
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
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
        mongoose.model('Password').create({
            username: username,
            email: email,
            password: password,
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
        }, function (err, password) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //password has been created
                  console.log('POST creating new password: ' + password);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("passwords");
                        // And forward to success page
                        res.redirect("/passwords");
                    },
                    //JSON response will show the newly created password
                    json: function(){
                        res.json(password);
                    }
                });
              }
        })
    });

/* GET New password page. */
router.get('/new', function(req, res) {
    res.render('passwords/new', { title: 'Add New password' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Password').findById(id, function (err, password) {
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
            //console.log(password);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Password').findById(req.id, function (err, password) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + password._id);
        var passwordcreated_at = password.created_at.toISOString();
        passwordcreated_at = passwordcreated_at.substring(0, passwordcreated_at.indexOf('T'));

        var passwordupdated_at = password.updated_at.toISOString();
        passwordupdated_at = passwordupdated_at.substring(0, passwordupdated_at.indexOf('T'));
        res.format({
          html: function(){
              res.render('passwords/show', {
                "passwordcreated_at" : passwordcreated_at,
                "passwordupdated_at" : passwordupdated_at,
                "password" : password
              });
          },
          json: function(){
              res.json(password);
          }
        });
      }
    });
  });

//GET the individual password by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the password within Mongo
    mongoose.model('Password').findById(req.id, function (err, password) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the password
            console.log('GET Retrieving ID: ' + password._id);
            //format the date properly for the value to show correctly in our edit form
            var passwordcreated_at = password.created_at.toISOString();
            passwordcreated_at = passwordcreated_at.substring(0, passwordcreated_at.indexOf('T'))

            var passwordupdated_at = password.updated_at.toISOString();
            passwordupdated_at = passwordupdated_at.substring(0, passwordupdated_at.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.hbs' template
                html: function(){
                       res.render('passwords/edit', {
                          title: 'password' + password._id,
                          "passwordcreated_at" : passwordcreated_at,
                          "passwordupdated_at" : passwordupdated_at,
                          "password" : password
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(password);
                 }
            });
        }
    });
});

//PUT to update a password by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
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
        mongoose.model('Password').findById(req.id, function (err, password) {
            //update it
            password.update({
              username: username,
              email: email,
              password: password,
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
            }, function (err, passwordID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/passwords/" + password._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(password);
                         }
                      });
               }
            })
        });
});

//DELETE a password by ID
router.delete('/:id/edit', function (req, res){
    //find password by ID
    mongoose.model('Password').findById(req.id, function (err, password) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            password.remove(function (err, password) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + password._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/passwords");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({
                                 message : 'deleted',
                                 item : password
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
