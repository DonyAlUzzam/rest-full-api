const express = require("express");
const Role = require("../models/role");
const router = new express.Router();
const auth = require("../middleware/auth");

router.get("/roles", auth.checkRole, async (req, res, next) => {
    try {
        const listRole = await Role.find({}).select("_id role")
        res.status(200).json({
            success: true,
            message: listRole
        })
    } catch (error) {
        console.log(error);
    }
});

router.post("/roles", async (req, res, next) => {
    try {
        const role = new Role(req.body)
        await role.save()
        res.status(201).send({
            success: true,
            message: "Role has been Created!"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
})

module.exports = router;