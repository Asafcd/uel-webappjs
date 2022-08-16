module.exports ={
    isLoggedin(req, res, next) {
        //console.log(req.user)
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/login');
    },
    isNotLoggedin(req, res, next) {
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/login');
    },
    isAdmin(req,res,next){
        if(req.isAuthenticated()){
            if(req.user.id_rol===1){
                return next();
            }
            
        }
        return res.redirect('/login');
    }
}