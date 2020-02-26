const express = require("express");
const router = new express.Router();
const Category = require("../models/category");
const auth = require("../middleware/auth");
const ObjectID = require('mongodb').ObjectID

router.post("/category", auth.auth, auth.checkRole, async (req, res, next) => {
  const category = new Category({
    ...req.body,
    created_by: req.user._id});
  await category
    .save()
    .then(result => {
      res.status(201).send({
        success: true,
        message: "Category has been created!",
        category: result
      });
    })
    .catch(error => {
      res.status(200).send({ success: false, message: { error: error } });
    });
});

router.get("/category", async (req, res) => {
    try {
        await Category.find({})
        .select("_id category_name created_by createdAt")
        .populate("created_by")
        .exec(function (err, categories) {
          if (err) return handleError(err);
            res.status(200).send({success: true, message: "Get Category Success!", data : categories});
          })
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/category/:id", async (req, res) => {
    let id = req.params.id
    try {
        await Category.find({ _id : id})
        .select("_id category_name created_by")
        .exec(function (err, categories) {
          if (err) return handleError(err);
            res.status(200).send({success: true, message: "Get category Success!", data : categories});
          })
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/category/:id", auth.auth, auth.checkRole, async (req, res, next) => {
    if(!ObjectID.isValid(req.params.id)){
      res.status(404).send({data : "ID not Found!"})
  }
   try {
    await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { category_name: req.body.category_name } }
    )
      .then(result => {
        res
          .status(201)
          .send({ success: true, message: "Category has been updated!", data : result});
      })
      .catch(error => {
        res.status(500).send({ error: error });
      });
   } catch (e) {
    res.status(500).send({status: false, message: e.message, data: e });
   }
  });

router.delete("/category/:id", auth.auth, auth.checkRole, async (req, res, next) => {
  let id = req.params.id
    try {
          const category = await Category.findOneAndDelete({_id: id}); 
            if(category){
                res.status(201).send({
                    success: true,
                    message: "Category has been Deleted!",
                    data : category
                })
            }
       
    } catch (e) {
        res.status(500).send({
            message: "Delete failed"
        });
    }
});

module.exports = router;
