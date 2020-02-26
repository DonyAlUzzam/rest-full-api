const express = require("express");
const auth = require("../middleware/auth");
const Book = require("../models/book");
const multer = require("multer");
const ObjectID = require('mongodb').ObjectID


const router = new express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + "-" + file.originalname);
    }
  });
  
  const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
  });

router.post("/books", auth.auth, auth.checkRole, upload.single("cover"), async (req, res, next) => {
    const role = req.user.role
    try {
        req.body.cover = req.file.path;
        const books = new Book(req.body)
       
        await books.save()
        res.status(201).send({
            success: true,
            message: "Book has been Created!",
            book: books
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
});


router.get("/books", async (req, res) => {
    const pageNo = parseInt(req.query.pageNo)
    const size = parseInt(req.query.size)
    if(req.query.search){
        searchQuery = req.query.search
    }else{
        searchQuery = ""
    }
    const query = {}
    try {
        const totalCount = await Book.count({
            book_name: {$regex: searchQuery, $options: 'i'}
        })
        const totalPages = Math.ceil(totalCount / size)
        await Book.find({book_name: {$regex: searchQuery, $options: 'i'}}).skip(size * (pageNo - 1)).limit(size ).populate('category_id')
        .exec(function (err, books) {
            if (err) return handleError(err);
            res.status(200).send({status: true, message: 'success get data.', "totalCount": totalCount, "currentPage": pageNo, "per_page": size, "totalPages":totalPages, data: books});
            })
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/book/:id", async (req, res) => {
    let id = req.params.id
    try {
        await Book.find({ _id : id})
        .populate('category_id')
        .exec(function (err, books) {
          if (err) return handleError(err);
            res.status(200).send({status: true, message: 'success get data.', data: books});
          })
    } catch (e) {
        res.status(500).send(e);
    }
});


router.get('/filter-books', async (req, res) => {
    const pageNo = parseInt(req.query.pageNo)
    const size = parseInt(req.query.size)
   
   
    try {
        const totalCount = await Book.count({category_id: req.query.filter})
        const totalPages = Math.ceil(totalCount / size)
        await Book.find({category_id: req.query.filter}).skip(size * (pageNo - 1)).limit(size )
        .exec(function (err, books) {
            if (err) return handleError(err);
            res.status(200).send({status: true, message: 'success get data.', "totalCount": totalCount, "currentPage": pageNo, "per_page": size, "totalPages":totalPages, data: books});
            })
    } catch (e) {
        res.status(500).send(e);
    }
})

router.delete("/book/:id", auth.auth, auth.checkRole, async (req, res) => {
    let id = req.params.id
    try {
        const books = await Book.findOneAndDelete({_id: id}); 
        if(books){
            res.status(201).send({
                success: true,
                message: "Book has been Deleted!"
            })
        }
    } catch (e) {
        res.status(200).send({
            message: "Delete failed"
        });
    }
});


router.patch('/book/:id', auth.auth, auth.checkRole, async (req, res) => {
    try {
        let update = req.body
        let id = req.params.id

        const books = await Book.findOneAndUpdate({_id  : id}, {$set: update},
            {new: true}).exec()  
        if(books){
            res.status(201).send({
                success: true,
                message: "Book has been Updated!",
                data: books
            })
        }  
    } catch (error) {
        res.status(500).send({
            message: "Updated failed"
        });
    }
});

module.exports = router;