const dbPool = require("../db");
const responseUtil = require("../utils/response.util");

async function createCart(req, res) {
    const {
        product_id,
        quantity
    } = req.body;
    try {
        user_id = req.tokenData.id
        if (!product_id)
            throw new Error("product_id field is missing!");
        if (!quantity)
            throw new Error("quantity field is missing!");
        let [product] = await dbPool.query(`select *
                                            from products
                                            where id = ${product_id}`);
        if (!product.length) throw new Error("prod not exist");

        await dbPool.query(`DELETE
                            FROM cart_items
                            WHERE user_id = ${user_id}
                              AND product_id = ${product_id};`);

        await dbPool.query(`INSERT INTO cart_items(user_id, product_id, quantity)
                            VALUES (${user_id}, ${product_id}, ${quantity})`);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function deleteCart(req, res) {
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

        if (!row.length) throw new Error("cart not found");

        await dbPool.query(`DELETE
                            FROM cart_items
                            WHERE id = ${id}`);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getAllCart(req, res) {
    user_id = req.tokenData.id

    try {
        const [row] = await dbPool.query(`  SELECT cart_items.*,
                                                   products.brand,
                                                   products.country,
                                                   products.type,
                                                   products.description,
                                                   products.name,
                                                   products.product_quantity,
                                                   products.price_each,
                                                   products.image_url
                                            FROM cart_items
                                                     INNER JOIN products
                                                                ON cart_items.product_id = products.id
                                            WHERE user_id = ${user_id};`);
        res.json(responseUtil.success({data: {row}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}


module.exports = {
    createCart,
    deleteCart,
    getAllCart
};