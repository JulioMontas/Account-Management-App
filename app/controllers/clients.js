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

//build the REST operations at the base for clients
//this will be accessible from http://127.0.0.1:3000/clients if the default route for / is left unchanged
router.route('/')
    //GET all clients
    .get(function(req, res, next) {
        //retrieve all clients from Monogo
        mongoose.model('Client').find({}, function (err, clients) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/clients folder. We are also setting "clients" to be an accessible variable in our ejs view
                    html: function(){
                        res.render('clients/index', {
                              title: 'All my clients',
                              "clients" : clients
                          });
                    },
                    //JSON response will show all clients in JSON format
                    json: function(){
                        res.json(clients);
                    }
                });
              }
        });
    })
    //POST a new client
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var company = req.body.company;
        var position = req.body.position;
        var email = req.body.email;
        var contact_number = req.body.contact_number;
        var project_summary = req.body.project_summary;
        var task_list = req.body.task_list;
        var created_at = req.body.created_at;
        //call the create function for our database
        mongoose.model('Client').create({
          name: name,
          company: company,
          position: position,
          email: email,
          contact_number: contact_number,
          project_summary: project_summary,
          task_list: task_list,
          created_at: created_at
        }, function (err, client) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //client has been created
                  console.log('POST creating new client: ' + client);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("clients");
                        // And forward to success page
                        res.redirect("/clients");
                    },
                    //JSON response will show the newly created client
                    json: function(){
                        res.json(client);
                    }
                });
              }
        })
    });

/* GET New client page. */
router.get('/new', function(req, res) {
    res.render('clients/new', { title: 'Add New client' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Client').findById(id, function (err, client) {
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
            //console.log(client);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Client').findById(req.id, function (err, client) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + client._id);
        var clientcreated_at = client.created_at.toISOString();
        clientcreated_at = clientcreated_at.substring(0, clientcreated_at.indexOf('T'));

        res.format({
          html: function(){
              res.render('clients/show', {
                "clientcreated_at" : clientcreated_at,
                "client" : client
              });
          },
          json: function(){
              res.json(client);
          }
        });
      }
    });
  });

//GET the individual client by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the client within Mongo
    mongoose.model('Client').findById(req.id, function (err, client) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the client
            console.log('GET Retrieving ID: ' + client._id);
            //format the date properly for the value to show correctly in our edit form
            var clientcreated_at = client.created_at.toISOString();
            clientcreated_at = clientcreated_at.substring(0, clientcreated_at.indexOf('T'))

            res.format({
                //HTML response will render the 'edit.hbs' template
                html: function(){
                       res.render('clients/edit', {
                          title: 'client' + client._id,
                          "clientcreated_at" : clientcreated_at,
                          "client" : client
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(client);
                 }
            });
        }
    });
});

//PUT to update a client by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var company = req.body.company;
    var position = req.body.position;
    var email = req.body.email;
    var contact_number = req.body.contact_number;
    var project_summary = req.body.project_summary;
    var task_list = req.body.task_list;
    var created_at = req.body.created_at;
   //find the document by ID
        mongoose.model('Client').findById(req.id, function (err, client) {
            //update it
            client.update({
              name: name,
              company: company,
              position: position,
              email: email,
              contact_number: contact_number,
              project_summary: project_summary,
              task_list: task_list,
              created_at: created_at
            }, function (err, clientID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/clients/" + client._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(client);
                         }
                      });
               }
            })
        });
});

//DELETE a client by ID
router.delete('/:id/edit', function (req, res){
    //find client by ID
    mongoose.model('Client').findById(req.id, function (err, client) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            client.remove(function (err, client) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + client._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/clients");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({
                                 message : 'deleted',
                                 item : client
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
