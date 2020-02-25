const express = require("express");
const router = new express.Router();
const Order = require("../models/order");
const auth = require("../middleware/auth");
const ObjectID = require('mongodb').ObjectID
const Book = require("../models/book");

router.post("/orders", auth.auth, async (req, res, next) => {
  const order = new Order({
    ...req.body,
    user: req.user._id});
  await order
    .save()
    .then(result => {
      res.status(201).send({
        success: true,
        message: "Order Success",
        order: result
      });
    })
    .catch(error => {
      res.status(500).send({ success: false, message: { error: error } });
    });
});

router.get('/orders', auth.auth, async (req, res) => {
  try {
      await Order.aggregate([
          {
              $match:{
                user:req.user._id,
                is_done: false
              }
          },
          { 
              $lookup: { 
                  from: "books",
                  localField: "book_id", 
                  foreignField: "_id", 
                  as: "dataOrders "
              }
          }
      ], async (err, response) => {
          if(err){
              res.status(500).send(err)
          } else {
              res.status(200).send(response)
          }
      })
  } catch (error) {
      res.status(500).send(error)
  }
})

router.get('/order/:id', auth.auth, async (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
      res.status(404).send({data : "ID not Found!"})
  }
  try {
      await Order.aggregate([
          {
              $match:{
                _id: ObjectID(req.params.id),
                user:req.user._id
              }
          },
          { 
              $lookup: { 
                  from: "books",
                  localField: "book_id", 
                  foreignField: "_id", 
                  as: "dataOrders "
              }
          }
      ], async (err, response) => {
          if(err){
              res.status(500).send(err)
          } else {
            console.log(response)
              res.status(200).send(response)
          }
      })
  } catch (error) {
      res.status(500).send(error)
  }
})

router.patch("/order/:id", auth.auth, async (req, res, next) => {
  if(!ObjectID.isValid(req.params.id)){
    res.status(404).send({data : "ID not Found!"})
}
  await Order.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { total: req.body.total } }
  )
    .then(result => {
      res
        .status(201)
        .send({ success: true, message: "Order has been updated!",});
    })
    .catch(error => {
      res.status(500).send({ error: error });
    });
});

router.patch("/order/pay/:id", auth.auth, async (req, res, next) => {
  try {
      await Book.findById(req.body.book_id, async (err, response ) => {
        const oldStok = response.qty
        const newStok = oldStok - req.body.total
        const filter = {_id: ObjectID(req.body.book_id)}
        const update = {qty: newStok}

        if(req.body.total < oldStok){
          await Book.findOneAndUpdate(filter, update, {
              new:true
          })
          await Order.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { is_done: true } }
          )
          res.status(201).send({ success: true, message: "Order Berhasil Terbayar" })
        }else {
          res.send({message: `Qty terlalu banyak, Jumlah Qty Available ${oldStok}`})
        }
      })
 
    } catch (error) {
        res.status(500).send(error)
    }
    });

router.delete("/order/:id", auth.auth, async (req, res, next) => {
  let id = req.params.id
    try {
        const order = await Order.findOneAndDelete(id); 
        if(order){
            res.status(201).send({
                success: true,
                message: "order has been Deleted!"
            })
        }
    } catch (e) {
        res.status(500).send({
            message: "Delete failed"
        });
    }
});

module.exports = router;
