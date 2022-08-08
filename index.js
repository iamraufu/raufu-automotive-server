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

const userName = process.env.USER;
const password = process.env.PASSWORD;

const uri = `mongodb+srv://${userName}:${password}@eftykharrahman.lih5zus.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const userCollection = client.db("RaufuAutomative").collection("Users");
  const mechanicCollection = client.db("RaufuAutomative").collection("Mechanics");
  const orderCollection = client.db("RaufuAutomative").collection("Orders");

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
    mechanicCollection.insertOne(mechanicDetails, (err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while adding mechanic'
      }) : res.send({
        status: true,
        message: 'Mechanic Added Successfully!'
      })
    })
  })

  // get all mechanics
  app.get('/mechanics', (req, res) => {
    mechanicCollection.find(
      // {isActive: true}
    ).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting mechanics'
      }) : res.send(result)
    })
  })

  // get mechanic by id
  app.get('/mechanic/:id', (req, res) => {
    const id = req.params.id;
    mechanicCollection.findOne({
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
    mechanicCollection.updateOne({
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
    mechanicCollection.deleteOne({
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

  // get all mechanics by category
  app.get('/mechanics/:category', (req, res) => {
    const category = req.params.category;
    mechanicCollection.find({
      category: category,
      isActive: true
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting mechanics'
      }) : res.send({
        status: true,
        message: 'Mechanics fetched successfully',
        mechanics: result
      })
    })
  })

  // get all mechanics by category and location
  app.get('/mechanics/:category/:location', (req, res) => {
    const category = req.params.category;
    const location = req.params.location;
    mechanicCollection.find({
      category: category,
      location: location,
      isActive: true
    }).toArray((err, result) => {
      err ? res.send({
        status: false,
        message: 'Error while getting mechanics'
      }) : res.send({
        status: true,
        message: 'Mechanics fetched successfully',
        mechanics: result
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

  // get order by email
  app.get('/order/:email', (req, res) => {
    const email = req.params.email;
    orderCollection.findOne({
      email: email
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
  console.log(`Raufu Automotive Backend Running on port ${port}`)
})