const ProductCollection = require('../model/product')
const UserCollection = require('../model/user_details')
const BannerCollection = require('../model/banner_details')
const CategoryCollection = require('../model/category');
const offerCollection= require('../model/offer');
const ContactCollection = require('../model/contact_users')
const titleUpperCase = require('../public/scripts/title_uppercase')



const nodemailer = require('nodemailer')


//nodemailer authentication sender config
const senderConfig = {
    host: "abhi@gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD
    }
};

module.exports = {
    homepage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true }).skip(num * 3).limit(3)
            const count = await ProductCollection.countDocuments({ isAvailable: true })
           const topBanners = await BannerCollection.find({ name: 'homepage_top_banner' })

            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])

                res.render('index', { isUser: true, products, count,topBanners, cartAndWish, navIt: 'home' })
            } else {
                res.render('index', { products, count, topBanners, navIt: 'home' })
            }

        } catch (e) {
            console.log(e)
        }
    },
    contactPage: (req, res) => {
        if (req.session.user) {
            return res.render('contact', { isUser: true })
        }
        res.render('contact', { navIt: 'contact' })
    },
    contact: async (req, res) => {
        try {
            const contactData = req.body
            const isExist = await ContactCollection.findOne({ email: contactData.email })
            
            console.log(isExist)
            if (!isExist) {
                const newContact = await ContactCollection.create(contactData)
                const transporter = nodemailer.createTransport(senderConfig)

                const mailOptions = {
                    from: senderConfig.auth.user,
                    to: contactData.email,
                    subject: 'welcome to PawsNClaws',
                    text: `Thank you for reaching out to us through our contact form. We appreciate your interest in PawsNClaws.

                We have received your message and would like to assure you that our team is reviewing your inquiry. We understand the importance of your request and will make every effort to respond promptly.
                
                If your inquiry is time-sensitive, please feel free to reach out to us directly at 8129984474, and we will do our best to assist you as soon as possible.`
                }

                await transporter.sendMail(mailOptions);

                const isRespond = await ContactCollection.findOneAndUpdate({ email: contactData.email }, { $set: { isRespond: true } })
                console.log(isRespond)
            }
            res.redirect('/contact')

        } catch (e) {
            console.log(e)
            res.redirect('/404-not-found')
        }

    },
  
    productsPage: async (req, res) => {
        const num = req.session?.num ? Number(req.session.num) : 0;
        try {
            const products = await ProductCollection.find({ isAvailable: true })
            const count = await ProductCollection.countDocuments({ isAvailable: true })
            const categories = await CategoryCollection.find()
            const offer = await offerCollection.findOne()
            let productOffer = null
            if (offer) {
                let offerTitle = null
                let offerContent = `for any ${offer.category} products`
                let offerImage = `/${offer.image.slice(7)}`
                if (offer.offerType === 'flat') {
                    offerTitle = `flat ₹${offer.offerValue} off`

                } else {
                    offerTitle = `${offer.offerValue}% off`
                }
                productOffer = {
                    offerTitle,
                    offerContent,
                    offerImage,
                }

            }
            if (req.session.user) {
                const cartAndWish = await UserCollection.aggregate([
                    {
                        $match: {
                            email: req.session.user
                        }

                    },
                    {
                        $project: {
                            cartIds: '$cart.product_id',
                            wishListIds: '$wishlist.product_id'
                        }
                    }
                ])
                res.render('products', { isUser: true, products, count, categories, cartAndWish, navIt: 'product', productOffer })
            } else {
                res.render('products', { products, count, categories, navIt: 'product', productOffer })
            }

        } catch (e) {
            console.log(e)
        }
    },
}