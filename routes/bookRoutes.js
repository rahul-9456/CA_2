const express = require("express");
const mongoose = require("mongoose");
const Book = require("../model/Book");

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        
        const { title, author, category } = req.body;

        
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({      
                message: "Book title is required"
            });
        }

       
        if (typeof author !== "string" || !author.trim()) {
            return res.status(400).json({
                message: "Author is required"
            });
        }

        
        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        
        const book = new Book({
            title,
            author,
            category
        });

        
        const savedBook = await book.save();

        
        return res.status(201).json({
            message: "Book added successfully",
            data: savedBook
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to add book",
            error: error.message
        });
    }
});




router.get("/", async (req, res) => {
    try {
        
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 5);

        
        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({

                message: "Page must be positive and limit must be between 1 and 100"
            });
        }

        
        const skip = (page - 1) * limit;

        
        // const books = await Book.find()
        //     .sort({ createdAt: -1 })
        //     .skip(skip)
        //     .limit(limit);

        
        // const totalRecords = await Book.countDocuments();
            const [books, totalRecords] = await Promise.all([
            Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

            Book.countDocuments()
        ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
       
        metadata: {
            currentPage: page,
            limit: limit,
            totalRecords: totalRecords,
            totalPages: totalPages
        },
        data: books
    });

      

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message
        });
    }
});



router.patch("/:id", async (req, res) => {
    try {
        
        const { id } = req.params;

        
        const { availability } = req.body;

        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID"
            });
        }

        
        if (typeof availability !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Availability must be true or false"
            });
        }

        
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { $set: { availability: availability } },
            {
                new: true
                
            }
        );

        
        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        
        return res.status(200).json({
            message: "Book availability updated successfully",
            data: updatedBook
        });

    } catch (error) {
        return res.status(500).json({

            message: "Failed to update book",
            error: error.message
        });
    }
});



module.exports = router;