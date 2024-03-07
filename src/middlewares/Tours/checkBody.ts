export const checkBody = (req:any,res:any,next:any) => {
    console.log('in the second middleware');
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status:'failed',
            message: 'Request body failed'

        })
    }
    next();
}
