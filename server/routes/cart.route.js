const express = require("express");
const { CartModel } = require("../modals/cart.modal");
const cartRouter = express.Router();
const { middleware } = require("../middleware/middleware");
// cartRouter.get("/", (req, res) => {
//     res.send("Cart home page")
// })

cartRouter.get("/", async (req, res) => {
  try {
    const cartdata = await CartModel.find();
    res.send(cartdata);
  } catch (err) {
    res.send({ msg: "Data is not present", error: err.message });
  }
});

cartRouter.post("/addtocart", middleware, async (req, res) => {
  try {
    let cart = new CartModel(req.body);
    //console.log(req.body)
    await cart.save();
    // console.log(ans)
    res.send("Added to cart");
  } catch (err) {
    res.send({ Msg: err.message });
  }
});

module.exports = { cartRouter };
