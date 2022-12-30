// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

/**
 * BASIC PHASE 1, Step A - Import model
 */
// Your code here
const { Tree } = require('../db/models')
/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step A:
 *   Import Op to perform comparison operations in WHERE clauses
 **/
// Your code here

/**
 * BASIC PHASE 1, Step B - List of all trees in the database
 *
 * Path: /
 * Protocol: GET
 * Parameters: None
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get('/', async (req, res, next) => {
    let trees = [];

    // Your code here
    const findTrees = await Tree.findAll({
        attributes: ["heightFt", "tree", "id"],
        order: [["heightFt", "DESC"]]
    })
    trees.push(findTrees)

    res.json(trees);
});

/**
 * BASIC PHASE 1, Step C - Retrieve one tree with the matching id
 *
 * Path: /:id
 * Protocol: GET
 * Parameter: id
 * Response: JSON Object
 *   - Properties: id, tree, location, heightFt, groundCircumferenceFt
 */
router.get('/:id', async (req, res, next) => {
    let tree;

    try {
        // Your code here
        const selectTree = await Tree.findOne({
            where: {
                id: req.params.id
            }
        })

        tree = selectTree

        if (tree) {
            res.json(tree);
        } else {
            next({
                status: "not-found",
                message: `Could not find tree ${req.params.id}`,
                details: 'Tree not found'
            });
        }
    } catch (err) {
        next({
            status: "error",
            message: `Could not find tree ${req.params.id}`,
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});

/**
 * BASIC PHASE 2 - INSERT tree row into the database
 *
 * Path: /trees
 * Protocol: POST
 * Parameters: None
 * Request Body: JSON Object
 *   - Properties: name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully created new tree
 *   - Property: data
 *     - Value: object (the new tree)
 */
router.post('/', async (req, res, next) => {
    const { name, location, height, size } = req.body

    const newTree = Tree.create({
        tree: name,
        location: location,
        heightFt: height,
        groundCircumferenceFt: size
    })

    try {
        res.json({
            status: "success",
            message: "Successfully created new tree",
        });
    } catch (err) {
        next({
            status: "error",
            message: 'Could not create new tree',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});

/**
 * BASIC PHASE 3 - DELETE a tree row from the database
 *
 * Path: /trees/:id
 * Protocol: DELETE
 * Parameter: id
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully removed tree <id>
 * Custom Error Handling:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not remove tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.delete('/:id', async (req, res, next) => {

    const removeTree = await Tree.destroy({
        where: {
            id: req.params.id
        }
    })

    if (removeTree) {
        res.json({
            status: "success",
            message: `Successfully removed tree ${req.params.id}`,
        });
    } else {
        next({
            status: "not-found",
            message: `Could not remove tree ${req.params.id}`,
            details: "Tree not found"
        })
    }

    // try {
    //     res.json({
    //         status: "success",
    //         message: `Successfully removed tree ${req.params.id}`,
    //     });
    // } catch (err) {
    //     next({
    //         status: "error",
    //         message: `Could not remove tree ${req.params.id}`,
    //         details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
    //     });
    // }
});


/**
 * INTERMEDIATE PHASE 4 - UPDATE a tree row in the database
 *   Only assign values if they are defined on the request body
 *
 * Path: /trees/:id
 * Protocol: PUT
 * Parameter: id
 * Request Body: JSON Object
 *   - Properties: id, name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully updated tree
 *   - Property: data
 *     - Value: object (the updated tree)
 * Custom Error Handling 1/2:
 *   If id in request params does not match id in request body,
 *   call next() with error object
 *   - Property: status
 *     - Value: error
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: <params id> does not match <body id>
 * Custom Error Handling 2/2:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.put("/:id", async (req, res, next) => {
    try {
        // Your code here
        const { id, name, location, height, size } = req.body;

        if (id !== Number(req.params.id)) {
            res.json({
                status: 'error',
                message: 'Could not update tree',
                details: `${req.params.id} does not match ${id}`
            })
        }

        const changedTree = await Tree.update({
            tree: name,
            location: location,
            heightFt: height,
            groundCircumferenceFt: size,
        }, { where: { id: req.params.id } }
        );

        if (changedTree[0] === 1) {
            res.json({
                status: "Success",
                message: "Sussessfully updated tree",
                data: { name, location, height, size }
            });
        } else {
            res.json({
                status: 'error',
                message: 'Could not update tree',
                details: "Tree not found!!!!!!"
            })

        }

    } catch (err) {
        next({
            status: "error",
            message: "Could not update new tree",
            details: err.errors
                ? err.errors.map((item) => item.message).join(", ")
                : err.message,
        });
    }
});

/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step B:
 *   List of all trees with tree name like route parameter
 *
 * Path: /search/:value
 * Protocol: GET
 * Parameters: value
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get('/search/:value', async (req, res, next) => {
    let trees = [];


    res.json(trees);
});

// Export class - DO NOT MODIFY
module.exports = router;
