const dbPool = require("../db");
const responseUtil = require("../utils/response.util");

async function getProductDetail(req, res) {
    try {
        const [row] = await dbPool.query(`  SELECT COLUMN_NAME, COLUMN_TYPE
                                            FROM information_schema.COLUMNS
                                            WHERE TABLE_NAME = 'products';`);
        res.json(responseUtil.success({data: {row}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getProduct(req, res) {
    const {id} = req.params;
    try {
        const [row] = await dbPool.query(`  SELECT *
                                            FROM products
                                            WHERE id = ${id};`);
        res.json(responseUtil.success({data: {row}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getAllProduct(req, res) {
    const {
        price_low,
        price_high,
        size,
        brand,

        country,
        type
    } = req.query;
    try {
        let where_condition = ``
        if (type) {
            where_condition += `AND type = "${type}"`
        }
        if (country) {
            where_condition += `AND country = "${country}"`
        }
        if (brand) {
            where_condition += `AND brand = "${brand}"`
        }
        if (size) {
            where_condition += `AND size = "${size}"`
        }
        if (price_low) {
            where_condition += `AND price_each >= ${price_low}`
        }
        if (price_high) {
            where_condition += `AND price_each <= ${price_high}`
        }
        const [row] = await dbPool.query(`  SELECT *
                                            FROM products
                                            WHERE 1 = 1 ${where_condition}`);
        console.log(brand)
        res.json(responseUtil.success({data: {row}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function createProduct(req, res) {
    const {
        name,
        size,
        brand,
        country,
        type,
        description,
        product_quantity,
        price_each,
        image_url

    } = req.body;
    try {
        if (!name)
            throw new Error("name field is missing!");
        if (!size)
            throw new Error("size field is missing!");
        if (!brand)
            throw new Error("brand field is missing!");
        if (!country)
            throw new Error("country field is missing!");
        if (!type)
            throw new Error("type field is missing!");
        if (!description)
            throw new Error("description field is missing!");
        if (!product_quantity)
            throw new Error("description field is missing!");
        if (!price_each)
            throw new Error("price_each field is missing!");
        if (!image_url)
            throw new Error("image_url field is missing!");
        await dbPool.query(`INSERT INTO products(name, size, brand, country, type, description, product_quantity,
                                                 price_each, image_url)
                            VALUES ("${name}", "${size}", "${brand}", "${country}", "${type}", "${description}",
                                    ${product_quantity},
                                    ${price_each}, "${image_url}")`);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function deleteProduct(req, res) {
    const {
        id
    } = req.params;
    try {
        user_id = req.tokenData.id
        if (!id)
            throw new Error("product_id field is missing!");
        const [row] = await dbPool.query(`  SELECT *
                                            FROM cart_items
                                            WHERE id = ${id}
                                              AND user_id = ${user_id};`);

        if (!row.length) throw new Error("product not found");

        await dbPool.query(`DELETE
                            FROM products
                            WHERE id = ${id}`);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    getProductDetail,
    createProduct,
    getProduct,
    getAllProduct,
    deleteProduct
};