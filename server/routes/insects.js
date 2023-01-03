// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

/**
 * INTERMEDIATE BONUS PHASE 2 (OPTIONAL) - Code routes for the insects
 *   by mirroring the functionality of the trees
 */
// Your code here
const { Insect } = require("../db/models")
const { Op } = require("sequelize")

router.get("/", async (req, res, next) => {
    const insectList = await Insect.findAll({
        attributes: ["id", "name", "millimeters"],
        order: [["millimeters", "DESC"]]
    })

    res.json(insectList)
})

router.get("/:id", async (req, res, next) => {
    const insectFinder = await Insect.findByPk(req.params.id)

    res.json(insectFinder)
})

router.post("/", async (req, res, next) => {
    const { name, description, fact, territory, millimeters } = req.body

    const newBug = await Insect.create({
        name: name,
        description: description,
        fact: fact,
        territory: territory,
        millimeters: millimeters
    })

    res.json({
        message: "Successfully created!",
        data: newBug
    })
})

router.delete("/:id", async (req, res, next) => {
    await Insect.destroy({
        where: {
            id: req.params.id
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

router.put("/:id", async (req, res, next) => {
    const { name, description, fact, territory, millimeters } = req.body

    const betterBug = await Insect.findByPk(req.params.id)
    betterBug.update({
        name: name,
        description: description,
        fact: fact,
        territory: territory,
        millimeters: millimeters
    })

    res.json({
        message: "Succesfully updated!",
        data: betterBug
    })
})

router.get("/search/:name", async (req, res, next) => {
    const namedBug = await Insect.findAll({
        where: {
            name: {
                [Op.substring]: `%${req.params.name}%`
            }
        }
    })
    res.json(namedBug)
})
// Export class - DO NOT MODIFY
module.exports = router;
