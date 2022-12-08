
const stripeObj = require("stripe")(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

    let transformedItems = []
    await req.body.forEach((item,index) => {
      let transformedItem = {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: req.body[index].product_title,
          },
          unit_amount: parseFloat(req.body[index].price.split("£")[1]) * 100,
        },
        quantity: req.body[index].quantity,
      }

      transformedItems.push(transformedItem)
    });

    const session = await stripeObj.checkout.sessions.create({
        line_items: transformedItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    
    res.json({msg: session.url})

}