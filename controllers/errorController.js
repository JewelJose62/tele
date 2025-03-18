exports.get404 = (req, res) => {
    console.log("404 handler triggered for:", req.originalUrl); // Debugging Log
    res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Oops! The page you're looking for does not exist.",
    });
};




exports.get500 = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
        errorCode: 500,
        errorMessage: "Something went wrong! Please try again later.",
    });
};
