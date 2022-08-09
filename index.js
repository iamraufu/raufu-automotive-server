const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

app.use(bodyParser.json(), cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
})

// const userName = process.env.USER;
// const password = process.env.PASSWORD;

const uri = `mongodb+srv://abid:rkw76MDhb7hkLPzL@cluster0.6slzlhs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const userCollection = client.db("homecleaningserviceofbd").collection("Users");
  const serviceBoyCollection = client.db("homecleaningserviceofbd").collection("ServiceBoys");
  const orderCollection = client.db("homecleaningserviceofbd").collection("Orders");

  // register user 
  app.post('/register', (req, res) => {
    const userDetails = req.body;
    userCollection.insertOne(userDetails, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while registering user'
      }) : res.send({
        status: true,
        message: 'User registered successfully'
      })
    })
  })

  // login user
  app.post('/login', (req, res) => {
    const userDetails = req.body;
    userCollection.findOne({
      email: userDetails.email,
      password: userDetails.password
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while logging in user'
      }) : res.send({
        status: true,
        message: 'User logged in successfully',
        user: result
      })
    })
  })

  // get all users
  app.get('/users', (req, res) => {
    userCollection.find({}).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting users'
      }) : res.send({
        status: true,
        message: 'Users fetched successfully',
        users: result
      })
    })
  })

  // get user by email
  app.get('/user/:email', (req, res) => {
    const email = req.params.email;
    userCollection.findOne({
      email: email
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting user'
      }) : res.send({
        status: true,
        message: 'User fetched successfully',
        user: result
      })
    })
  })

  // update user
  app.patch('/user/:id', (req, res) => {
    const id = req.params.id;
    const userDetails = req.body;
    userCollection.updateOne({
      _id: ObjectId(id)
    }, {
      $set: userDetails
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while updating user'
      }) : res.send({
        status: true,
        message: 'User updated successfully'
      })
    })
  })

  // delete user
  app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    userCollection.deleteOne({
      _id: ObjectId(id)
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while deleting user'
      }) : res.send({
        status: true,
        message: 'User deleted successfully'
      })
    })
  })

  // add new mechanic
  app.post('/mechanic', (req, res) => {
    const mechanicDetails = req.body;
    serviceBoyCollection.insertOne(mechanicDetails, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while adding mechanic'
      }) : res.send({
        status: true,
        message: 'Mechanic Added Successfully!'
      })
    })
  })

  // get all ServiceBoys
  app.get('/ServiceBoys', (req, res) => {
    serviceBoyCollection.find(
      // {isActive: true}
    ).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting ServiceBoys'
      }) : res.send(result)
    })
  })

  // get mechanic by id
  app.get('/mechanic/:id', (req, res) => {
    const id = req.params.id;
    serviceBoyCollection.findOne({
      _id: ObjectId(id)
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting mechanic'
      }) : res.send(result)
    })
  })

  // update mechanic
  app.patch('/mechanic/:id', (req, res) => {
    const id = req.params.id;
    const mechanicDetails = req.body;
    serviceBoyCollection.updateOne({
      _id: ObjectId(id)
    }, {
      $set: mechanicDetails
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while updating mechanic'
      }) : res.send({
        status: true,
        message: 'Mechanic updated successfully'
      })
    })
  })

  // delete mechanic
  app.delete('/mechanic/:id', (req, res) => {
    const id = req.params.id;
    serviceBoyCollection.deleteOne({
      _id: ObjectId(id)
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while deleting mechanic'
      }) : res.send({
        status: true,
        message: 'Mechanic Deleted Successfully!'
      })
    })
  })

  // get all ServiceBoys by category
  app.get('/ServiceBoys/:category', (req, res) => {
    const category = req.params.category;
    serviceBoyCollection.find({
      category: category,
      isActive: true
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting ServiceBoys'
      }) : res.send({
        status: true,
        message: 'ServiceBoys fetched successfully',
        ServiceBoys: result
      })
    })
  })

  // get all ServiceBoys by category and location
  app.get('/ServiceBoys/:category/:location', (req, res) => {
    const category = req.params.category;
    const location = req.params.location;
    serviceBoyCollection.find({
      category: category,
      location: location,
      isActive: true
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting ServiceBoys'
      }) : res.send({
        status: true,
        message: 'ServiceBoys fetched successfully',
        ServiceBoys: result
      })
    })
  })

  // add new order
  app.post('/order', (req, res) => {
    const orderDetails = req.body;
    orderCollection.insertOne(orderDetails, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while adding order'
      }) : res.send({
        status: true,
        message: 'Order added successfully'
      })
    })
  })

  // get all orders
  app.get('/orders', (req, res) => {
    orderCollection.find({}).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting orders'
      }) : res.send({
        status: true,
        message: 'Orders fetched successfully',
        orders: result
      })
    })
  })

  // get order by id
  app.get('/order/:id', (req, res) => {
    const id = req.params.id;
    orderCollection.findOne({
      _id: ObjectId(id)
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting order'
      }) : res.send({
        status: true,
        message: 'Order fetched successfully',
        order: result
      })
    })
  })

  // get order by phone
  app.get('/order/:phone', (req, res) => {
    const phone = req.params.phone;
    orderCollection.findOne({
      phone: phone
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting order'
      }) : res.send({
        status: true,
        message: 'Order fetched successfully',
        order: result
      })
    })
  })

  // update order
  app.patch('/order/:id', (req, res) => {
    const id = req.params.id;
    const orderDetails = req.body;
    orderCollection.updateOne({
      _id: ObjectId(id)
    }, {
      $set: orderDetails
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while updating order'
      }) : res.send({
        status: true,
        message: 'Order updated successfully'
      })
    })
  })

  // delete order
  app.delete('/order/:id', (req, res) => {
    const id = req.params.id;
    orderCollection.deleteOne({
      _id: ObjectId(id)
    }, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while deleting order'
      }) : res.send({
        status: true,
        message: 'Order deleted successfully'
      })
    })
  })

  // get all orders by mechanic id
  app.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    orderCollection.find({
      mechanicId: id
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting orders'
      }) : res.send({
        status: true,
        message: 'Orders fetched successfully',
        orders: result
      })
    })
  })

  // get all orders by mechanic id and date 
  app.get('/orders/:id/:date', (req, res) => {
    const id = req.params.id;
    const date = req.params.date;
    orderCollection.find({
      mechanicId: id,
      date: date
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting orders'
      }) : res.send({
        status: true,
        message: 'Orders fetched successfully',
        orders: result
      })
    })
  })


  err ? console.log(err) : console.log("MongoDB Database Connected Successfully!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Service Boy Bangladesh Backend Running on port ${port}`)
})