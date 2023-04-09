module.exports.isLoggedIn = (req,res,next)=>{//islooged in check that if the person then only give acces to the page
    if(!req.isAuthenticated()){//passport join isauthenticated method to req object automatically
    //if user is not logged in and they try to go on a secured page it takes its url and when they signed in we will redirect them to same url
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must signed in');
    return res.redirect('/login')}
    else{
    next()}
}