const BannerCollection = require('../model/banner_details')

module.exports ={
    editBannerPage : (req,res)=>{
        req.session.bannerPath = req.params.path
        res.render('banner-edit',{isAdmin : true})
    },
    // editBanner : async (req,res)=>{
    //     const toDelete = req.session.bannerPath
    //     try{
    //     const images = []
    //     for (let each of req.files) {
    //         images.push('/' + each.path.slice(7))
    //     }

        
    //      const addBanner = await BannerCollection.findOneAndUpdate({name : 'homepage_top_banner'},
    //      {
    //         $push:{
    //             path : images
    //         }
        
    //      })
    //      if(toDelete){
    //         const deleted = await BannerCollection.findOneAndUpdate({name : 'homepage_top_banner'},{$pull :{path:{$regex : toDelete}}})
    //         console.log(deleted)
    //      }
      
    //       res.redirect('/admin/others')

    //     }catch(e){
    //         console.log(e)
    //     }
    // }
    editBanner: async (req, res) => {
        try {
            const toDelete = req.session.bannerPath;
            
            if (!req.files) {
                throw new Error("No files were uploaded.");
            }
    
            const images = [];
            for (let each of req.files) {
                if (each.path) {
                    images.push('/' + each.path.slice(7));
                } else {
                    console.log("Warning: Skipping a file with undefined path.");
                }
            }
    
            if (images.length > 0) {
                const addBanner = await BannerCollection.findOneAndUpdate(
                    { name: 'homepage_top_banner' },
                    {
                        $push: {
                            path: images
                        }
                    }
                );
            }
    
            if (toDelete) {
                const deleted = await BannerCollection.findOneAndUpdate(
                    { name: 'homepage_top_banner' },
                    { $pull: { path: { $regex: toDelete } }
                });
                console.log(deleted);
            }
    
            res.redirect('/admin/others');
        } catch (e) {
            console.error("Error in editBanner:", e);
            res.status(500).send("An error occurred while processing your request.");
        }
    }
    
}