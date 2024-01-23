const dbPool = require("../db");
const responseUtil = require("../utils/response.util");

async function getAllOrder(req, res) {
    try {
        user_id = req.tokenData.id
        let row = []
        const [order] = await dbPool.query(`  SELECT *
                                              FROM orders;`);

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
    getAllOrder

};