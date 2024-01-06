const dbPool = require("../db");
const responseUtil = require("../utils/response.util");

async function getCategory(req, res) {
    try {
        const [row] = await dbPool.query(`  SELECT *
                                            FROM product_category`);
        res.json(responseUtil.success({data: {row}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}
async function createCategory(req, res) {
    const {
        name,
        desc
    } = req.body;
    try {
        if (!name) throw new Error("name field is missing");
        if (!desc) throw new Error("desc field is missing");
        const [existCategory] = await dbPool.query(`  SELECT *
                                                      FROM product_category
                                                      WHERE product_category.name = "${name}"`);
        if (existCategory.length) throw new Error("category name existed");
        console.log(`INSERT INTO product_category (name, desc)
                            VALUES ("${name}", "${desc}")`)
        await dbPool.query(`INSERT INTO product_category (name, desc)
                            VALUES ("${name}", "${desc}")`);

        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function removeCategory(req, res) {
    const {
        id
    } = req.body
    try {
        if (!id) throw new Error("id field is missing");
        const temp = await dbPool.query(`   DELETE
                                            FROM product_category
                                            WHERE product_category.id = "${id}"`);
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    createCategory,
    removeCategory,
    getCategory
};