const dbPool = require("../db");
const responseUtil = require("../utils/response.util");

async function createOrder(req, res) {
    const {
        cart_ids,
        address
    } = req.body;
    try {
        if (!address)
            throw new Error(`address missing`);
        if (!cart_ids)
            throw new Error(`cart_ids missing`);
        user_id = req.tokenData.id
        for (i = 0; i < cart_ids.length; i++) {
            let [cart] = await dbPool.query(`select *
                                             from cart_items
                                             where id = ${cart_ids[i]}`);
            if (!cart.length)
                throw new Error(`cart ${cart_ids[i]} not found`);
            let [product] = await dbPool.query(`select *
                                                from products
                                                where product_quantity > ${cart[0].quantity}
                                                  and id = ${cart[0].product_id}`);
            if (!product.length)
                throw new Error(`product not enough`);
        }


        let payment_code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (i = 0; i < 15; i++) {
            payment_code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        await dbPool.query(`INSERT INTO orders(user_id, payment_code, address)
                            VALUES (${user_id}, "${payment_code}", "${address}")`);
        let [order] = await dbPool.query(`select *
                                          from orders
                                          where payment_code = "${payment_code}"`);
        for (i = 0; i < cart_ids.length; i++) {
            let [cart] = await dbPool.query(`select *
                                             from cart_items
                                             where id = ${cart_ids[i]}`);
            if (!cart.length)
                throw new Error(`cart ${cart_ids[i]} not found`);
            let [product] = await dbPool.query(`select *
                                                from products
                                                where product_quantity > ${cart[0].quantity}
                                                  and id = ${cart[0].product_id}`);
            if (!product.length)
                throw new Error(`product not enough`);
            await dbPool.query(`INSERT INTO order_items(price_each, quantity, product_id, order_id)
                                VALUES (${product[0]['price_each']}, ${cart[0].quantity}, ${cart[0].product_id},
                                        ${order[0].id})`);

            await dbPool.query(`DELETE
                                FROM cart_items
                                WHERE id = ${cart_ids[i]}`);
        }

        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getOrder(req, res) {

    const {
        id
    } = req.params;
    try {
        user_id = req.tokenData.id
        if (!id)
            throw new Error("id field is missing!");
        const [order] = await dbPool.query(`  SELECT *
                                              FROM orders
                                              WHERE id = ${id}
                                                AND user_id = ${user_id};`);
        if (!order.length) throw new Error("order not found");

        const [order_items] = await dbPool.query(`  SELECT order_items.*,
                                                           products.brand,
                                                           products.country,
                                                           products.type,
                                                           products.description,
                                                           products.name,
                                                           products.image_url
                                                    FROM order_items
                                                             INNER JOIN products ON order_items.product_id = products.id
                                                    WHERE order_id = ${id};`);

        res.json(responseUtil.success({data: {order: order[0], order_items: order_items}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getAllOrder(req, res) {
    try {
        user_id = req.tokenData.id
        let row = []
        const [order] = await dbPool.query(`  SELECT *
                                              FROM orders
                                              WHERE user_id = ${user_id};`);

        for (i = 0; i < order.length; i++) {
            let [order_items] = await dbPool.query(`  SELECT order_items.*,
                                                             products.brand,
                                                             products.country,
                                                             products.type,
                                                             products.description,
                                                             products.name,
                                                             products.image_url
                                                      FROM order_items
                                                               INNER JOIN products ON order_items.product_id = products.id
                                                      WHERE order_id = ${order[i]["id"]};`);
            let obj = {
                "order": order[i],
                "order_items": order_items
            }
            row.push(obj)
        }


        res.json(responseUtil.success({data: {row}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}


module.exports = {
    createOrder,
    getOrder,
    getAllOrder

};