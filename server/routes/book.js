const express = require("express");

const Bookrouter = express.Router();
const Books = require("../modals/Book");
 // const kitab = require("../config/books.json");
// const Bookrouter = require("express").Router();
// const Books = require("../modals/Book");
Bookrouter.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 27;
		const search = req.query.search || "";
		let sort = req.query.sort || "ratings";
		let category = req.query.category || "All";

		const categoryOptions = [
			"fiction",
			"non-fiction",
			"kids"
		];

		category === "All"
			? (category = [...categoryOptions])
			: (category = req.query.category.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const BooksList = await Books.find({ title: { $regex: search, $options: "i" } })
			.where("category")
			.in([...category])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Books.countDocuments({
			category: { $in: [...category] },
			title: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			category: categoryOptions,
			BooksList,
			
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

Bookrouter.get("/:id",async(req,res)=>{
	let num = req.params.id;
	try{
		let data = await Books.findById({_id:num});
		res.send(data)
	} catch(err){
		res.send(err.message)
	}
})

Bookrouter.post("/post",async(req,res)=>{
	let payload = req.body
     try{
		let data = new Books(payload);
		await data.save();
		res.send("Data Added Successfully")
	 } catch(err){
		res.send(err.message);
		console.log(err)
	 }
})

Bookrouter.patch("/update/:id",async(req,res)=>{
    let bookId= req.params.id;
 try{
    await Books.findByIdAndUpdate({_id:bookId},req.body);
    res.send("Updated")
    
 }
 
    catch(err)
    {
        res.send({"msg":"Cannot Modify", "error":err.message})
 
    }
 })
 
 //delete book data
 Bookrouter.delete("/delete/:id",async (req,res)=>{
    const ID=req.params.id
    // res.send(ID)
   try
    {
       await Books.findByIdAndDelete({_id:ID})
       res.send({"msg":"Data Deleted"})
      }
    catch(err)
    {
        res.send({"msg":"Cannot Deleted", "error":err.message})
 
    }
 })
 

// const insertBooks = async () => {
//     try {
//         const docs = await Books.insertMany(kitab);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertBooks()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))



module.exports = {Bookrouter};